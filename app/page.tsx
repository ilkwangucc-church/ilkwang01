export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-8">
          <div className="w-20 h-1 bg-blue-400 mx-auto mb-6 rounded-full" />
          <p className="text-blue-300 text-sm tracking-[0.3em] uppercase mb-4">
            Coming Soon
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            사이트가 곧<br />
            <span className="font-semibold text-blue-300">시작됩니다</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            더 나은 모습으로 여러분을 만나기 위해<br />
            준비 중입니다. 잠시만 기다려 주세요.
          </p>
        </div>
        <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full" />
      </div>
    </main>
  )
}
