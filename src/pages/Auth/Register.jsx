import {useState} from "react";

export default function Register()
{
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");

  const handleSubmit=e=>{
    e.preventDefault();
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Sign up</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <button type="submit" className="bg-blue-600 text-white rounded p-2">
        Create account
      </button>
    </form>
    </div>
  );
}