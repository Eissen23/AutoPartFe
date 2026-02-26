import { useNavigate, Link } from "react-router";
import { useSignup } from "#src/hooks/auth";
import type { SignupInfo } from "#src/hooks/auth";
import { Col, Row, Form, Input, Button, Checkbox } from "antd";

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const {
    mutate: signup,
    isPending,
    error,
  } = useSignup({
    onSuccess: () => {
      navigate("/login");
    },
  });
  const [form] = Form.useForm();

  const apiError = error?.message;

  const onFinish = (values: SignupFormValues) => {
    signup({
      username: values.username,
      email: values.email,
      password: values.password,
    } as SignupInfo);
  };

  return (
    <Row className="h-full" justify="center" gutter={[0, 0]}>
      <Col lg={0} xl={16}>
        <div className="relative">
          <img className="dimming" src="/wall/sign-up-bg.png" />
          <h1
            className="relative text-white text-6xl italic font-black"
            style={{ paddingTop: 70, paddingLeft: 90 }}
          >
            AutoPart
          </h1>
        </div>
      </Col>

      <Col
        span={24}
        lg={16}
        xl={8}
        style={{ padding: 40 }}
        className="flex justify-center content-center"
      >
        <div>
          <h2 className="text-3xl font-semibold text-center mb-5">Sign Up</h2>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label={
                <label className="text-sm font-medium text-gray-600">
                  Username
                </label>
              }
              name="username"
              rules={[
                { required: true, message: "Username is required" },
                {
                  min: 3,
                  message: "Username must be at least 3 characters",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Choose a username"
                disabled={isPending}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
              }
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                disabled={isPending}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={
                <label className="text-sm font-medium text-gray-600">
                  Password
                </label>
              }
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
              ]}
            >
              <Input
                type="password"
                placeholder="Create a password"
                disabled={isPending}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={
                <label className="text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
              }
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input
                type="password"
                placeholder="Confirm your password"
                disabled={isPending}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="agreeToTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "You must agree to the terms and conditions",
                          ),
                        ),
                },
              ]}
            >
              <Checkbox disabled={isPending}>
                <span className="text-xs text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    terms and conditions
                  </a>
                </span>
              </Checkbox>
            </Form.Item>

            {apiError && (
              <div className="p-3 bg-red-50 border border-red-500 rounded-md text-red-500 text-sm text-center">
                {apiError}
              </div>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              className="py-3 px-4 font-semibold uppercase text-sm tracking-wide"
              block
            >
              SIGN UP
            </Button>
          </Form>

          <div className="flex justify-center mt-6 pt-5 border-t border-gray-200">
            <span className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline ml-1"
              >
                Login
              </Link>
            </span>
          </div>
        </div>
      </Col>
    </Row>
  );
}
