import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#F7FAFF] to-white">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Welcome Back
        </h2>

        <form className="mt-6 space-y-4">
          <input
            className="w-full border rounded px-4 py-2"
            placeholder="Email"
          />
          <input
            className="w-full border rounded px-4 py-2"
            type="password"
            placeholder="Password"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
