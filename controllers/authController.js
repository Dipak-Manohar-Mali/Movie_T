import { comparePassword, hashPassword } from "../Helper/authHelper.js"
import userModel from "../models/userModel.js"


export const registerController = async(req,res)=>{
    try {

            const {name, email, password,role=0 } = req.body

            if(!name)
            {
                res.send({error:'name is Required'})
            }
    
            if(!email)
            {
                res.send({error:'email is Required'})
            }
    
            if(!password)
            {
                res.send({error:'password is Required'})
            }


        //check user
        const existingUser = await userModel.findOne({email})

        //existing user
        if(existingUser)
        {
            return res.status(200).send({
                success:false,
                message:'User Already Register, Please login'
            })
        }
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({name,email,password:hashedPassword,role}).save()
        
        if(user){
            const userWithoutPass = await userModel.findById(user._id).select("-password")
            res.status(201).send({
                success:true,
                message:"user Register Successfuly",
                userWithoutPass,
            })
        }

        

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:"Error in While registering the User",
            error
        })
    }

}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            
            return res.status(400).send({
                success: false,
                message: 'Invalid Username or password'
            });
        }

        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "You are Not Registered!!!, Please Register First"
            });
        }

        const match = await comparePassword(password, user.password); // Assuming comparePassword is defined and working correctly
        if (!match) {
            console.log("checking")
            return res.status(401).send({
                success: false,
                message: "Invalid Credential"
            });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                role:user.role,
            },
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
    }

    
};