import { useState } from 'react';
import Icon from '@/components/ui/icon';

const payments = [
  { id: 1, desc: 'Членский взнос Q2 2026', date: '01.04.2026', amount: '4 500 ₽', status: 'Оплачено', statusCls: 'text-green-600 bg-green-50' },
  { id: 2, desc: 'Членский взнос Q1 2026', date: '05.01.2026', amount: '4 500 ₽', status: 'Оплачено', statusCls: 'text-green-600 bg-green-50' },
  { id: 3, desc: 'Взнос на ремонт кровли', date: '15.11.2025', amount: '2 000 ₽', status: 'Оплачено', statusCls: 'text-green-600 bg-green-50' },
  { id: 4, desc: 'Членский взнос Q4 2025', date: '02.10.2025', amount: '4 500 ₽', status: 'Оплачено', statusCls: 'text-green-600 bg-green-50' },
  { id: 5, desc: 'Членский взнос Q3 2026', date: '—', amount: '4 500 ₽', status: 'Ожидается', statusCls: 'text-amber-600 bg-amber-50' },
];

const notifications = [
  { icon: 'Bell', text: 'Новое объявление: отключение электроэнергии 26 апреля', time: '2 ч назад', unread: true },
  { icon: 'Vote', text: 'Открыто голосование по ремонту въездных ворот', time: '2 дня назад', unread: true },
  { icon: 'FileText', text: 'Опубликован протокол собрания №4/2026', time: '2 нед назад', unread: false },
];

export default function Cabinet() {
  const [tab, setTab] = useState<'info' | 'payments' | 'notifications'>('info');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Личный кабинет</h1>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-5 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold select-none">
          АП
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">Петров Александр Николаевич</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Член ГСК «Авангард» с 2018 года</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground"><Icon name="Car" size={14} /> Бокс № 147</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><Icon name="Phone" size={14} /> +7 (912) 345-67-89</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><Icon name="Mail" size={14} /> petrov@mail.ru</span>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-border px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Icon name="Pencil" size={14} />
          Редактировать
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([['info', 'Информация'], ['payments', 'Платежи'], ['notifications', 'Уведомления']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Членский номер', value: 'ГСК-0147' },
            { label: 'Площадь бокса', value: '24 м²' },
            { label: 'Ряд / Место', value: 'Ряд 5, место 7' },
            { label: 'Дата вступления', value: '14 марта 2018' },
            { label: 'Задолженность', value: 'Отсутствует' },
            { label: 'Голосований участвовал', value: '8 из 10' },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
              <span className="text-muted-foreground text-sm">{item.label}</span>
              <span className="font-semibold text-foreground text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Описание</th>
                <th className="text-left px-3 py-3 text-muted-foreground font-medium hidden sm:table-cell">Дата</th>
                <th className="text-left px-3 py-3 text-muted-foreground font-medium">Сумма</th>
                <th className="text-right px-5 py-3 text-muted-foreground font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{p.desc}</td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden sm:table-cell">{p.date}</td>
                  <td className="px-3 py-3.5 font-semibold text-foreground">{p.amount}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${p.statusCls}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.text} className={`bg-card border rounded-lg p-4 flex items-start gap-3 ${n.unread ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
              <div className="bg-primary/10 p-2 rounded-lg mt-0.5">
                <Icon name={n.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className={`text-sm leading-snug ${n.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{n.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {n.unread && <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
