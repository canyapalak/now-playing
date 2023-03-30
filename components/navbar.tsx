import Link from "next/link";

export default function Navbar() {

    const Logo = "/assets/logo.png";

    return (
        <div className='mb-20 w-full border-pink-700 border-2 rounded-lg p-3'>
        <Link href="/"><img src={Logo} alt="Logo" className='w-40' /></Link></div>
    )
}