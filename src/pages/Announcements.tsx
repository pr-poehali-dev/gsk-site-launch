import { useState } from 'react';
import Icon from '@/components/ui/icon';

const categories = ['Все', 'Важное', 'Объявления', 'Ремонт', 'Разное'];

const items = [
  {
    id: 1, cat: 'Важное', date: '24 апр 2026', author: 'Правление ГСК',
    title: 'Отключение электроэнергии 26 апреля',
    text: 'В связи с плановыми техническими работами 26 апреля с 09:00 до 14:00 будет отключена электроэнергия во всём кооперативе. Просьба учесть при планировании.',
    pinned: true,
  },
  {
    id: 2, cat: 'Ремонт', date: '18 апр 2026', author: 'Комиссия по инфраструктуре',
    title: 'Ямочный ремонт главной дороги',
    text: 'С 22 по 25 апреля будет проводиться ямочный ремонт главной дороги кооператива. Въезд через боковые ворота.',
    pinned: false,
  },
  {
    id: 3, cat: 'Объявления', date: '10 апр 2026', author: 'Петров А.Н.',
    title: 'Продам металлические стеллажи',
    text: 'Продаю стеллажи металлические б/у, 2 шт. Высота 1,8 м. Цена договорная. Бокс №147.',
    pinned: false,
  },
  {
    id: 4, cat: 'Разное', date: '5 апр 2026', author: 'Иванова М.С.',
    title: 'Найден ключ на территории',
    text: 'На территории между рядами 3 и 4 найден связка ключей. Обращаться к сторожу или в правление.',
    pinned: false,
  },
];

export default function Announcements() {
  const [active, setActive] = useState('Все');
  const [showForm, setShowForm] = useState(false);

  const filtered = items.filter((i) => active === 'Все' || i.cat === active);
  const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Объявления</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Актуальная информация для членов кооператива</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Icon name="Plus" size={16} />
          Добавить объявление
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-foreground">Новое объявление</h3>
          <input
            placeholder="Заголовок"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            placeholder="Текст объявления..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">Отмена</button>
            <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Опубликовать</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active === c
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.map((item) => (
          <div key={item.id} className={`bg-card border rounded-xl p-5 ${item.pinned ? 'border-amber-300 bg-amber-50/40' : 'border-border'}`}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {item.pinned && (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  <Icon name="Pin" size={11} /> Закреплено
                </span>
              )}
              <span className="text-xs font-semibold bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{item.cat}</span>
              <span className="text-xs text-muted-foreground ml-auto">{item.date}</span>
            </div>
            <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.text}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="User" size={12} />
              <span>{item.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
