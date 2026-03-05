import { Card } from "@/shared/ui";

const MENU_ITEMS = [
  { label: "결혼 정보 수정", href: "/settings/wedding-info" },
  { label: "예산 설정", href: "/settings/budget" },
  { label: "파트너 관리", href: "/settings/partner" },
  { label: "알림 설정", href: "/settings/notifications" },
  { label: "이용약관", href: "/settings/terms" },
  { label: "개인정보처리방침", href: "/settings/privacy" },
  { label: "로그아웃", href: "#", danger: true },
];

export default function SettingsPage() {
  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      <h1 className="mb-5 text-xl font-bold text-neutral-900">설정</h1>

      {/* Profile */}
      <Card className="mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <span className="text-lg">W</span>
          </div>
          <div>
            <p className="font-semibold">웨플 사용자</p>
            <p className="text-sm text-neutral-500">카카오 계정으로 로그인</p>
          </div>
        </div>
      </Card>

      {/* Menu */}
      <Card padding="sm">
        <ul className="divide-y divide-neutral-50">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center justify-between py-3.5 px-1"
              >
                <span
                  className={
                    "danger" in item && item.danger
                      ? "text-sm text-error"
                      : "text-sm text-neutral-700"
                  }
                >
                  {item.label}
                </span>
                {"danger" in item && item.danger ? null : (
                  <svg
                    className="h-4 w-4 text-neutral-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-6 text-center text-xs text-neutral-300">
        Wepl v0.1.0
      </p>
    </div>
  );
}
