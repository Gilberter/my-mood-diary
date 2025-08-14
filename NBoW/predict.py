import torch
import torchtext.vocab
import torchtext.data.utils
from NBoW import NBoW
from collections import Counter
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import pickle
from fastapi.middleware.cors import CORSMiddleware



path = "."
with open(f"{path}/vocab.pkl", "rb") as f:
    vocab = pickle.load(f)


vocab_size = vocab.__len__()
print(vocab_size)
embedding_dim = 50
output_dim = 2
padding_indx = vocab["<unk>"]
print(padding_indx)

model = NBoW(vocab_size=vocab_size, embedding_dim=embedding_dim, output_dim=output_dim, pad_index=padding_indx)

vectors = torchtext.vocab.GloVe(name="6B", dim=50, cache=f"{path}/.vector_cache")
pretrained_embedding = vectors.get_vecs_by_tokens(vocab.get_itos())
model.load_state_dict(torch.load(f"{path}/nbow.pt"))

print(pretrained_embedding.shape)
print(f"Pre-trained wights shape: {model.embedding.weight.data.shape}")
print(f"Pre-trained embedding shape: {pretrained_embedding.shape}")

# This line will only work if the shapes match.
if pretrained_embedding.shape == model.embedding.weight.data.shape:
    model.embedding.weight.data = pretrained_embedding
    print("Pre-trained GloVe embeddings assigned successfully.")
else:
    print("Warning: GloVe embedding shape does not match model's embedding shape. Skipping..")



# Define request body
class TextRequest(BaseModel):
    text: str

app = FastAPI()

# Allowed origins
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:3000",  # If using default React port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Or ["*"] for all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict(req: TextRequest):
    tokenizer = torchtext.data.utils.get_tokenizer("basic_english")
    text = req.text
    tokens = tokenizer(text)
    ids = vocab.lookup_indices(tokens) 
    tensor = torch.LongTensor(ids).unsqueeze(0)
    with torch.no_grad():
        prediction = model(tensor).squeeze(0)
    probs = torch.softmax(prediction, dim=-1)
    predicted_class = probs.argmax().item()
    predicted_probability = probs[predicted_class].item()
    return JSONResponse(
        status_code=200,
        content={
            "status": True,
            "message": "Prediction completed successfully",
            "class": predicted_class,
            "probability": predicted_probability
        }
    )


@app.get("/")
def read_root():
    return {"message": "Hello from API"}