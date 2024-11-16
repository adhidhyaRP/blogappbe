import express from 'express'
import Users from '../models/usermodel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { transporter } from '../server.js'

const router = express.Router()

router.post('/register',async(req,res)=>{
    const {username,email,password} = req.body

    try {
        
        let user = await Users.findOne({email})
        if(user) return res.status(404).json({status:false,message:'User already exists,try with some other email'})

          const hashedpassword = await bcrypt.hash(password,10)
          
          user = new Users({username,email,password:hashedpassword})
          await user.save()
          console.log("hello")

          const token = jwt.sign({email:user.email},process.env.JWT_SECRET, { expiresIn: '1h' })

          const mailOptions = {
            from : process.env.EMAIL_USER,
            to:email,
            subject: 'Signup Verification',
            html: `<p>Click <a href='${process.env.FRONTEND_URL}/login'>here</a> to verify your email.</p>`

          }
          await transporter.sendMail(mailOptions)
          res.status(201).json({status:true,message:'User created. Verification email sent.'})


    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ status: false, message: 'Error creating user' });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await Users.findOne({ email });
        if (!user) return res.status(401).json({ status: false, message: 'User not registered' });

       
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(401).json({ status: false, message: 'Incorrect password' });

       
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ status: true, message: 'Login successful', userId: user._id  });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: false, message: 'Login failed' });
    }
});


router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    try {
       
        const user = await Users.findOne({ email });
        if (!user) return res.status(404).json({ status: false, message: 'User not found' });

       
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            html: `<p>Click <a href="${process.env.FRONTEND_URL}/resetpassword/${user._id}/${token}">here</a> to reset your password.</p>`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ status: true, message: 'Reset password email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ status: false, message: 'Error sending reset password email' });
    }
});

router.post('/resetpassword/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(400).json({ status: false, message: 'Invalid token' });

          
            const hashedPassword = await bcrypt.hash(password, 10);
            await Users.findByIdAndUpdate(id, { password: hashedPassword });
            res.status(200).json({ status: true, message: 'Password reset successful' });
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ status: false, message: 'Error resetting password' });
    }
});

export default router