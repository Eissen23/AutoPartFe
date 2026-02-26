import { useNavigate, Link } from "react-router";
import { useLoginManual } from "#src/hooks/auth";
import { Col, Row, Form, Input, Button } from "antd";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { performLogin, isLoading, error } = useLoginManual();
  const [form] = Form.useForm();

  const apiError = error?.message;
  const onFinish = (values: LoginFormValues) => {
    performLogin({
      loginCredentials: values.email,
      password: values.password,
    })
      .then(() => {
        navigate("/dashboard");
      })
      .catch(() => {
        // Error is already handled in isLoading and error state
      });
  };

  return (
    <Row className="h-full" justify="center" gutter={[0, 0]}>
      <Col lg={0} xl={16}>
        <div className="relative">
          <img className="dimming" src="/wall/login-bg.png" />
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
          <h2 className="text-3xl font-semibold text-center mb-5">Login</h2>

          <Form form={form} onFinish={onFinish} layout="vertical">
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
                disabled={isLoading}
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
                placeholder="Enter your password"
                disabled={isLoading}
                size="large"
              />
            </Form.Item>

            {apiError && (
              <div className="p-3 bg-red-50 border border-red-500 rounded-md text-red-500 text-sm text-center">
                {apiError}
              </div>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="py-3 px-4 font-semibold uppercase text-sm tracking-wide"
              block
            >
              LOGIN
            </Button>
          </Form>

          <div className="flex justify-center mt-6 pt-5 border-t border-gray-200">
            <span className="text-xs text-gray-600">
              Don't have a account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline ml-1"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </Col>
    </Row>
  );
}
