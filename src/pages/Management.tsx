import { useState } from 'react';
import Icon from '@/components/ui/icon';

const members = [
  { id: 1, name: 'Петров А.Н.', box: '147', status: 'paid', debt: '—', since: '2018' },
  { id: 2, name: 'Иванова М.С.', box: '23', status: 'paid', debt: '—', since: '2015' },
  { id: 3, name: 'Козлов П.Д.', box: '88', status: 'debt', debt: '9 000 ₽', since: '2020' },
  { id: 4, name: 'Фёдоров А.О.', box: '112', status: 'paid', debt: '—', since: '2019' },
  { id: 5, name: 'Смирнов В.К.', box: '5', status: 'debt', debt: '4 500 ₽', since: '2021' },
  { id: 6, name: 'Орлов С.П.', box: '67', status: 'paid', debt: '—', since: '2016' },
];

const votes = [
  { id: 1, title: 'Ремонт въездных ворот — выбор подрядчика', end: '30 апр 2026', yes: 18, no: 4, abstain: 2, total: 24, open: true },
  { id: 2, title: 'Повышение членского взноса с Q3 2026', end: '15 мая 2026', yes: 0, no: 0, abstain: 0, total: 231, open: true },
  { id: 3, title: 'Установка видеонаблюдения на въезде', end: '1 апр 2026', yes: 142, no: 67, abstain: 22, total: 231, open: false },
];

type Tab = 'members' | 'voting' | 'fees';

export default function Management() {
  const [tab, setTab] = useState<Tab>('members');
  const [search, setSearch] = useState('');
  const [voted, setVoted] = useState<Record<number, string>>({});

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.box.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Управление</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Администрирование кооператива</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {([['members', 'Члены ГСК'], ['voting', 'Голосования'], ['fees', 'Взносы']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'members' && (
        <div className="space-y-4">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени или номеру бокса..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Член ГСК</th>
                  <th className="text-left px-3 py-3 text-muted-foreground font-medium">Бокс</th>
                  <th className="text-left px-3 py-3 text-muted-foreground font-medium hidden sm:table-cell">Задолженность</th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-foreground">№ {m.box}</td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className={m.status === 'debt' ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>{m.debt}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${m.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {m.status === 'paid' ? 'Оплачено' : 'Долг'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'voting' && (
        <div className="space-y-4">
          {votes.map((v) => {
            const total = v.open ? v.total : v.yes + v.no + v.abstain;
            const voted_count = v.yes + v.no + v.abstain;
            const pct = total > 0 ? Math.round((voted_count / total) * 100) : 0;
            const myVote = voted[v.id];
            return (
              <div key={v.id} className={`bg-card border rounded-xl p-5 ${v.open ? 'border-amber-300' : 'border-border opacity-80'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-foreground leading-snug">{v.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold flex-shrink-0 ${v.open ? 'bg-amber-100 text-amber-700' : 'bg-secondary text-muted-foreground'}`}>
                    {v.open ? 'Открыто' : 'Завершено'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Срок: до {v.end} · Проголосовало: {voted_count} / {total} ({pct}%)</p>

                {v.open && !myVote ? (
                  <div className="flex gap-2">
                    {(['За', 'Против', 'Воздержусь'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setVoted((prev) => ({ ...prev, [v.id]: opt }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          opt === 'За' ? 'border-green-300 text-green-700 hover:bg-green-50' :
                          opt === 'Против' ? 'border-red-300 text-red-700 hover:bg-red-50' :
                          'border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : v.open && myVote ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700 font-medium flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} /> Вы проголосовали: {myVote}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[{ label: 'За', val: v.yes, cls: 'bg-green-500' }, { label: 'Против', val: v.no, cls: 'bg-red-500' }, { label: 'Воздержались', val: v.abstain, cls: 'bg-gray-400' }].map((r) => (
                      <div key={r.label} className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-muted-foreground">{r.label}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${r.cls} rounded-full`} style={{ width: `${total > 0 ? (r.val / total) * 100 : 0}%` }} />
                        </div>
                        <span className="w-8 text-right font-semibold text-foreground">{r.val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'fees' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Всего собрано в 2026', value: '876 500 ₽', icon: 'Banknote', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Задолженность', value: '13 500 ₽', icon: 'AlertCircle', color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Должников', value: '3 чел.', icon: 'Users', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>
                <Icon name={s.icon} size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
          <div className="md:col-span-3 bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Должники</h3>
            <div className="space-y-3">
              {members.filter((m) => m.status === 'debt').map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{m.name} (бокс № {m.box})</span>
                  <div className="flex items-center gap-3">
                    <span className="text-red-600 font-semibold">{m.debt}</span>
                    <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity">
                      Уведомить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
