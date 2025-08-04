import z from "zod";



export const createUserZod = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),

    phoneNumber: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    password: z
        .string()
        .min(6, { message: "Email must be at least 6 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    wallet: z.string().optional(),
    role: z.string(),

    createdAt: z.date().optional().default(new Date()),

    updatedAt: z.date().optional().default(new Date()),

    status: z.string().optional(),

    approved: z.boolean().optional().default(false),

    commissionRate: z.number().optional(),

    approvedBy: z.string().optional(),
})





export const updateUserZod = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),

    email: z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." })
        .optional(),

    phoneNumber: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

    wallet: z.string().optional(),

    role: z.string().optional(),

    createdAt: z.date().optional().default(new Date()),

    updatedAt: z.date().optional().default(new Date()),

    status: z.string().optional(),

    approved: z.boolean().optional().default(false),

    commissionRate: z.number().optional(),

    approvedBy: z.string().optional(),
});
