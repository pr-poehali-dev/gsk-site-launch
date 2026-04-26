import Icon from '@/components/ui/icon';

const stats = [
  { label: 'Боксов в кооперативе', value: '248', icon: 'Warehouse' },
  { label: 'Членов кооператива', value: '231', icon: 'Users' },
  { label: 'Оплачено взносов', value: '94%', icon: 'TrendingUp' },
  { label: 'Открытых вопросов', value: '3', icon: 'MessageSquare' },
];

const news = [
  {
    date: '24 апр 2026',
    tag: 'Важно',
    tagColor: 'bg-red-100 text-red-700',
    title: 'Плановое отключение электроэнергии',
    text: '26 апреля с 09:00 до 14:00 будет произведено плановое техническое обслуживание электросети.',
  },
  {
    date: '20 апр 2026',
    tag: 'Голосование',
    tagColor: 'bg-amber-100 text-amber-700',
    title: 'Голосование по ремонту въездных ворот',
    text: 'Открыто голосование за выбор подрядчика для ремонта главных въездных ворот. Примите участие.',
  },
  {
    date: '15 апр 2026',
    tag: 'Собрание',
    tagColor: 'bg-blue-100 text-blue-700',
    title: 'Итоги общего собрания членов ГСК',
    text: 'Опубликован протокол общего собрания от 12 апреля 2026 года. Утверждён план работ на лето.',
  },
];

const quickLinks = [
  { icon: 'FileText', label: 'Оплатить взнос', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: 'Vote', label: 'Участвовать в голосовании', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: 'Bell', label: 'Подать объявление', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: 'Phone', label: 'Связаться с управлением', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(220,55%,18%) 0%, hsl(220,50%,26%) 100%)' }}>
        <div className="px-8 py-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">Добро пожаловать</p>
              <h1 className="text-white text-3xl font-bold leading-tight mb-2">ГСК «Авангард»</h1>
              <p className="text-blue-200 text-base">Портал управления гаражным кооперативом</p>
            </div>
            <div className="text-right">
              <p className="text-blue-300 text-sm">Сегодня</p>
              <p className="text-white font-semibold text-lg">26 апреля 2026</p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 rounded-lg px-4 py-4 flex flex-col gap-2">
                <Icon name={s.icon} size={20} className="text-amber-400" />
                <p className="text-white text-2xl font-bold">{s.value}</p>
                <p className="text-blue-200 text-xs leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Новости */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Icon name="Newspaper" size={18} className="text-primary" />
            Последние события
          </h2>
          {news.map((n) => (
            <div key={n.title} className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${n.tagColor}`}>{n.tag}</span>
                <span className="text-xs text-muted-foreground">{n.date}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{n.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{n.text}</p>
            </div>
          ))}
        </div>

        {/* Быстрые действия */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Icon name="Zap" size={18} className="text-amber-500" />
            Быстрые действия
          </h2>
          <div className="space-y-3">
            {quickLinks.map((l) => (
              <button
                key={l.label}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-left`}
              >
                <div className={`${l.bg} ${l.color} p-2 rounded-md`}>
                  <Icon name={l.icon} size={18} />
                </div>
                <span className="font-medium text-sm text-foreground">{l.label}</span>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto" />
              </button>
            ))}
          </div>

          {/* Мой гараж */}
          <div className="bg-card border border-border rounded-lg p-5 mt-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Car" size={16} className="text-primary" />
              Мой бокс
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Номер бокса</span>
                <span className="font-semibold text-foreground">№ 147</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус взносов</span>
                <span className="font-semibold text-green-600">Оплачено</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Следующий платёж</span>
                <span className="font-semibold text-foreground">1 июля 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}