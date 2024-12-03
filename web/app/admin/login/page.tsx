import AdminLoginForm from "~/components/admin/adminLoginForm";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="md:-mt-32 relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <h2>管理者ログインページ</h2>
        <AdminLoginForm />
      </div>
    </main>
  );
}
