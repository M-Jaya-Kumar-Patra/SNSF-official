// import { NextResponse } from 'next/server';
// import connectDB from '../../../../../server/lib/database.js';
// import UserModel from '../../../../../server/models/user.model.js';
// import auth from '../../../../../server/middlewares/auth.js'; // your auth middleware

// const handler = async (req) => {
//   try {
//     await connectDB();
//     console.log("DB connected");

//     const userId = req.userId;
//     console.log("User ID from auth middleware:", userId);

//     if (!userId) {
//       return NextResponse.json({ message: "Unauthorized", error: true, success: false }, { status: 401 });
//     }

//     const user = await UserModel.findById(userId).select('-password -refresh_token');

//     if (!user) {
//       return NextResponse.json({ message: 'User not found', error: true, success: false }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'User details', data: user, error: false, success: true });
//   } catch (error) {
//     console.error("❌ Server Error:", error);
//     return NextResponse.json({ message: "Something went wrong", error: true, success: false }, { status: 500 });
//   }
// };


// export const GET = auth(handler); // export GET method wrapped with auth
