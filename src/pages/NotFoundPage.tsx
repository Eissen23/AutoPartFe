import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { Button } from "antd";
/**
 * 404 Not Found Page / Error Boundary
 */
export default function NotFoundPage() {
  const error = useRouteError();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "Something gone wrong";
  }

  return (
    <div
      className="error-page"
      style={{ padding: "2rem", textAlign: "center" }}
    >
      <div className="content-center mx-auto">
        <img src="/assets/404-error.png" width={300} height={300} />
        <h1 className="text-5xl font-bold mb-4">Page not found</h1>
        <p className="mx-auto mb-4">
          <i>{errorMessage}</i>
        </p>
        <Button type="default">
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
