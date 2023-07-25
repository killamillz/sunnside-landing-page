import mongoose, { Schema } from "mongoose"



export interface IBook {
     title:String,
     author:string,
     pageCount: number,
     datePublished:string,
     description: string,
     genre: string,
     Publisher: string,
     timestamp: boolean 
}

export const bookSchema = new Schema ({
     title: {
          type: String,
          required: [true, `please input your title`]
     },
     author: {
          type: String,
          required: [true, `please input your author`]
     },
     pageCount: {
          type: String,
          required: [true, `please input your pageCount`]
     },
     datePublished: {
          type: String,
          required: [true, `please input your datePublished`]
     },
     description: {
          type: String,
          required: [true, `please input your description`]
     },
     genre: {
          type: String,
          required: [true, `please input your genre`]
     },
     Publisher: {
          type: String,
          required: [true, `please input your Publisher`]
     }
})
// {
//      timestamp: true
// })

const Book = mongoose.model<IBook>('Book', bookSchema)

export default Book