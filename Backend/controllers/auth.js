import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connection from "../config/database.js";


const JWT_SECRET = process.env.JWT_SECRET;
// Support either JWT_EXPIRES_IN or JWT_EXPIRE (env-example uses JWT_EXPIRE)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '15m';

// Helper to convert expiry strings like '15m', '7d' to milliseconds for cookie maxAge
const parseExpiryToMs = (exp) => {
  if (!exp) return 15 * 60 * 1000; // default 15 minutes
  if (typeof exp === 'number') return exp;
  const match = String(exp).match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 15 * 60 * 1000;
  }
};

export const registerUser=async(req,res)=>{
  try {

  const {name, email, password}=req.body

  if(!name || !email || !password){
    return res.status(400).json({
      success:false,
      error:"All fields are required"
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    return res.status(400).json({
      success:false,
      error: "Please provide a valid email address"
    })

  }

   // Validate password strength
  if(password.length < 6){
    return res.status(400).json({
      success:false,
      error: "Password must be at least 6 characters long"
    })
  }

    // Check if user already exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    
    if(existingUsers.length>0){
      return res.status(409).json({
        success:false,
        error:"User already exists with this email"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
      )

      const token = jwt.sign(
        {id:result.insertId, email, name},
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      // Set cookie on registration so user is logged in immediately
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // Use 'lax' in development so cross-origin XHR (localhost:5173 -> localhost:5000) can send cookie
        sameSite: "lax",
        maxAge: parseExpiryToMs(JWT_EXPIRES_IN),
      });

     return res.status(201).json({
        success:true,
        message:"User registered successfully",
        token:token,
        user:{id: result.insertId, email, name}
      })

    

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      error:"Server error"
    })
  }
  }



export const loginUser=async(req, res)=>{

  try {
  const {email, password}= req.body

  // validate input

  if(!email || !password){
    return res.status(400).json({
      success:false,
      error:"Email and password are required"
    })
  }

  // finde user in database

  const [users]= await connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )

  if(users.length === 0){
    return res.status(401).json({
      success:false,
      error: "Invalid email or password",

    })
  }

  const user = users[0]

  // compare password

  const isMtach = await bcrypt.compare(password, user.password)
  if(!isMtach){
    return res.status(401).json({
      success:false,
      error:'Invalid password'
    })
  }

  const token=jwt.sign(
    {id:user.id, email:user.email, name:user.name},
    JWT_SECRET,
    {expiresIn: JWT_EXPIRES_IN}
  )
  // Send response (without password)
  const {password:_, ...userWithoutPassword}=user


     res
      .cookie("accessToken", token, {
        httpOnly: true,
        // secure: false, // set true in production (HTTPS)
        secure: process.env.NODE_ENV === "production",
        // Use 'lax' in development so cross-origin XHR (localhost:5173 -> localhost:5000) can send cookie
        sameSite: "lax",
        maxAge: parseExpiryToMs(JWT_EXPIRES_IN),
      })
      .json({
        success: true,
        message: "Login successful",
        token,
        user:userWithoutPassword
      });


    
  } catch (error) {
  console.log(error)
  res.status(500).json({
    success:false,
    error:"Server error"
  })
    
  }


}



export const logoutUser = (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      // Match sameSite used when setting the cookie
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};



// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const [users] = await pool.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );

//     if (!users.length) {
//       return res.status(401).json({ success:false, error:"Invalid credentials" });
//     }

//     const user = users[0];
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(401).json({ success:false, error:"Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.id },
//       JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     res.json({ success:true, token });

//   } catch {
//     res.status(500).json({ success:false, error:"Server error" });
//   }
// };
