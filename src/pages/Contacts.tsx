import Icon from '@/components/ui/icon';

const contacts = [
  { role: 'Председатель ГСК', name: 'Николаев Борис Иванович', phone: '+7 (910) 123-45-67', email: 'nikolaev@gsk-avangard.ru', icon: 'Crown' },
  { role: 'Бухгалтер', name: 'Громова Светлана Петровна', phone: '+7 (910) 234-56-78', email: 'gromova@gsk-avangard.ru', icon: 'Calculator' },
  { role: 'Техник', name: 'Захаров Дмитрий Сергеевич', phone: '+7 (910) 345-67-89', email: 'zaharov@gsk-avangard.ru', icon: 'Wrench' },
  { role: 'Охрана (сторож)', name: 'Круглов Виктор Фёдорович', phone: '+7 (910) 456-78-90', email: '—', icon: 'Shield' },
];

const schedule = [
  { day: 'Понедельник – пятница', hours: '09:00 – 17:00' },
  { day: 'Суббота', hours: '10:00 – 15:00' },
  { day: 'Воскресенье', hours: 'Выходной' },
  { day: 'Охрана (ежедневно)', hours: 'Круглосуточно' },
];

export default function Contacts() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Контакты</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Руководство и сотрудники кооператива</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((c) => (
          <div key={c.role} className="bg-card border border-border rounded-xl p-5 flex gap-4">
            <div className="bg-primary/10 p-3 rounded-xl h-fit">
              <Icon name={c.icon} size={22} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-0.5">{c.role}</p>
              <h3 className="font-bold text-foreground">{c.name}</h3>
              <div className="mt-2 space-y-1">
                <a href={`tel:${c.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Icon name="Phone" size={13} /> {c.phone}
                </a>
                {c.email !== '—' ? (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Icon name="Mail" size={13} /> {c.email}
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Mail" size={13} /> {c.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Clock" size={18} className="text-primary" />
            Часы работы правления
          </h2>
          <div className="space-y-3">
            {schedule.map((s) => (
              <div key={s.day} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{s.day}</span>
                <span className={`font-semibold ${s.hours === 'Выходной' ? 'text-muted-foreground' : 'text-foreground'}`}>{s.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address + feedback */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Icon name="MapPin" size={18} className="text-primary" />
              Адрес кооператива
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">г. Нижний Новгород,<br />ул. Гаражная, квартал 14<br />ГСК «Авангард»</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Send" size={18} className="text-primary" />
              Написать в правление
            </h2>
            <div className="space-y-2">
              <input
                placeholder="Ваше имя"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                placeholder="Ваш вопрос..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
