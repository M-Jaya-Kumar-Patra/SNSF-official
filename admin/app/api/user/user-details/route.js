// import { NextResponse } from 'next/server';
// import connectDB from '../../../../../server/lib/database.js';
// import AdminModel from '../../../../../server/models/admin.model.js';
// import auth from '../../../../../server/middlewares/auth.js'; // your auth middleware

// const handler = async (req) => {
//   try {
//     await connectDB();
//     console.log("DB connected");

//     const adminId = req.adminId;
//     console.log("Admin ID from auth middleware:", adminId);

//     if (!adminId) {
//       return NextResponse.json({ message: "Unauthorized", error: true, success: false }, { status: 401 });
//     }

//     const admin = await AdminModel.findById(adminId).select('-password -refresh_token');

//     if (!admin) {
//       return NextResponse.json({ message: 'Admin not found', error: true, success: false }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Admin details', data: admin, error: false, success: true });
//   } catch (error) {
//     console.error("❌ Server Error:", error);
//     return NextResponse.json({ message: "Something went wrong", error: true, success: false }, { status: 500 });
//   }
// };


// export const GET = auth(handler); // export GET method wrapped with auth
