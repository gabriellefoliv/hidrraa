import { LoginForm } from "@/components/Auth/LoginForm"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import HidraLogo from '../../assets/hidra-logo.png'

export default function Login() {
    return (
        <BackgroundGradientAnimation
            gradientBackgroundStart="#0A1A2F"
            gradientBackgroundEnd="#142F4B"
            firstColor="77, 166, 255"     
            secondColor="30, 144, 255"    
            thirdColor="51, 153, 255"     
            fourthColor="15, 42, 80"      
            fifthColor="128, 207, 255"   
            pointerColor="30, 144, 255"   
            size="80%"
            blendingValue="hard-light"
        >
            <div className="w-full min-h-screen flex items-center justify-center py-12 px-6">
                <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                    <div className="flex justify-center">
                        <img className="w-40 mx-auto mb-6" src={HidraLogo} />
                        <h2 className="flex-1 text-2xl font-semibold text-end text-sky-900 mb-6">Login</h2>
                    </div>
                    <LoginForm/>
                </div>
            </div>
        </BackgroundGradientAnimation>
    )
}