import {Response } from 'express';

export const sendResponse = (res:Response, status:number, data:any,message:string, success:boolean) => {
    res.status(status).json(
        {
            success: success,
            message,
            data,

        }
    )
}