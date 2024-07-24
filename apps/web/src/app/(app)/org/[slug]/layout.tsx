import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'

export default async function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="space-y-4 py-4">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="mx-auto w-full max-w-[1200px] py-4">{children}</main>
    </div>
  )
}
