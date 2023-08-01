import z from 'zod'

export const userSchema = z.object({
    lastName:  z.string({
        required_error: "Username is required!"
    }),
    firstName: z.string({
        required_error: "firstName is required!"
    }),
    gender: z.string({
        required_error: "Gender is required!"
    }),
    email: z.string({ 
        required_error: "Email is required!"
    }).email(),
    password:z.string({
        required_error: "Password is required!"
    }).min(5)
})

export const userSchema1 = z.object({

    _id: z.string({
        required_error: "Id is required"
    }),
    lastName:  z.string({
        required_error: "lastName is required!"
    }),
    firstName: z.string({
        required_error: "firstName is required!"
    }),
    gender: z.string({
        required_error: "Gender is required!"
    }),
    email: z.string({ 
        required_error: "Email is required!"
    }).email(),
    password:z.string({
        required_error: "Password is required!"
    }).min(5)
})

export const userSchema2 = z.object({
    email: z.string({
        required_error: "Email is required!"
    }).email(),
    password: z.string({
        required_error: "Password is required!"
    }).min(5)
})

export const userSchemaBooks = z.object({
    title: z.string({
        required_error: "Title is required!"
    }),
    author: z.string({
        required_error: "Author name is required!"
    }),
    datePublished: z.string({
        required_error: "Date published is required!"
    }),
    description: z.string({
        required_error: "Description is required!"
    }),
    pageCount: z.string({
        required_error: "The page count is required!"
    }),
    genre: z.string({
        required_error: "Genre is required!"
    }),
    Publisher: z.string({
        required_error: "Publisher name is required!"
    }), 
})


