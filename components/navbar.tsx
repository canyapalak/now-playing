import Link from "next/link";

export default function Navbar() {

    const Logo = "/assets/logo.png";

    return (
        <div className='mb-20 w-full border-pink-700 border-2 rounded-lg p-3 flex justify-center'>
            <Link href="/"><img src={Logo} alt="Logo" className='h-16' /></Link></div>
    )
}