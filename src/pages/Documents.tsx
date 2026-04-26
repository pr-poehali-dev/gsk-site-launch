import { useState } from 'react';
import Icon from '@/components/ui/icon';

const categories = ['Все', 'Устав', 'Протоколы', 'Финансы', 'Договоры', 'Заявления'];

const docs = [
  { id: 1, name: 'Устав ГСК «Авангард»', cat: 'Устав', date: '12.01.2024', size: '1.2 МБ', icon: 'BookOpen' },
  { id: 2, name: 'Протокол общего собрания № 4/2026', cat: 'Протоколы', date: '12.04.2026', size: '420 КБ', icon: 'FileText' },
  { id: 3, name: 'Протокол общего собрания № 3/2025', cat: 'Протоколы', date: '18.10.2025', size: '380 КБ', icon: 'FileText' },
  { id: 4, name: 'Финансовый отчёт за 2025 год', cat: 'Финансы', date: '28.02.2026', size: '860 КБ', icon: 'BarChart2' },
  { id: 5, name: 'Смета расходов на 2026 год', cat: 'Финансы', date: '12.01.2026', size: '540 КБ', icon: 'BarChart2' },
  { id: 6, name: 'Договор аренды земельного участка', cat: 'Договоры', date: '01.03.2022', size: '1.8 МБ', icon: 'Landmark' },
  { id: 7, name: 'Бланк заявления о вступлении в ГСК', cat: 'Заявления', date: '01.01.2025', size: '96 КБ', icon: 'FilePen' },
  { id: 8, name: 'Бланк заявления на ремонт', cat: 'Заявления', date: '01.01.2025', size: '88 КБ', icon: 'FilePen' },
];

export default function Documents() {
  const [active, setActive] = useState('Все');
  const [search, setSearch] = useState('');

  const filtered = docs.filter((d) => {
    const matchCat = active === 'Все' || d.cat === active;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Документы</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Официальные документы кооператива</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Icon name="Upload" size={16} />
          Загрузить документ
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Categories */}
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

      {/* List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Icon name="FileX" size={40} className="mx-auto mb-3 opacity-30" />
            <p>Документы не найдены</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Название</th>
                <th className="text-left px-3 py-3 text-muted-foreground font-medium hidden md:table-cell">Категория</th>
                <th className="text-left px-3 py-3 text-muted-foreground font-medium hidden sm:table-cell">Дата</th>
                <th className="text-left px-3 py-3 text-muted-foreground font-medium hidden lg:table-cell">Размер</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-1.5 rounded">
                        <Icon name={d.icon} size={16} className="text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">{d.cat}</span>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden sm:table-cell">{d.date}</td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden lg:table-cell">{d.size}</td>
                  <td className="px-3 py-3.5 text-right">
                    <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 ml-auto">
                      <Icon name="Download" size={15} />
                      <span className="hidden sm:inline text-xs">Скачать</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
