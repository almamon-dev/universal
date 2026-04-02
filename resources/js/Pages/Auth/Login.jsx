import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <AuthLayout leftImage="/img/2.png" rightBackgroundImage="/img/1.png">
            <Head title="Log in" />

            <div className="glass-card">
                <div className="mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-lg text-gray-600">
                        Sign in to access your dashboard.
                    </p>
                </div>

                {status && (
                    <div className="mb-6 p-4 rounded-md bg-green-50 text-sm font-medium text-green-600 border border-green-100">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <InputLabel
                            htmlFor="username"
                            value="Username"
                            className="text-gray-700 font-medium"
                        />

                        <TextInput
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={data.username}
                            className="mt-1 block w-full login-input"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.username}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="text-gray-700 font-medium"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={data.password}
                            className="mt-1 block w-full login-input"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <button className="login-button mt-8" disabled={processing}>
                        {processing ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}
