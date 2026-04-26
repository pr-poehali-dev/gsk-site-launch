import { useState } from 'react';
import Icon from '@/components/ui/icon';

const topics = [
  {
    id: 1, cat: 'Вопросы', title: 'Как оплатить взнос онлайн?', author: 'Смирнов В.К.', date: '23 апр',
    replies: 4, views: 38, lastReply: 'Бухгалтер ГСК', hot: false,
  },
  {
    id: 2, cat: 'Голосование', title: 'Предложение по видеонаблюдению — установить камеры на въезде', author: 'Козлов П.Д.', date: '20 апр',
    replies: 12, views: 87, lastReply: 'Иванова М.С.', hot: true,
  },
  {
    id: 3, cat: 'Инфраструктура', title: 'Протечка крыши в ряду №3 — требует ремонта', author: 'Фёдоров А.О.', date: '19 апр',
    replies: 7, views: 54, lastReply: 'Председатель', hot: false,
  },
  {
    id: 4, cat: 'Общение', title: 'Где найти хорошего сварщика в городе?', author: 'Петров А.Н.', date: '15 апр',
    replies: 9, views: 61, lastReply: 'Орлов С.П.', hot: false,
  },
  {
    id: 5, cat: 'Вопросы', title: 'Порядок переоформления бокса при продаже', author: 'Морозова Е.В.', date: '10 апр',
    replies: 3, views: 29, lastReply: 'Бухгалтер ГСК', hot: false,
  },
];

const catColors: Record<string, string> = {
  'Вопросы': 'bg-blue-100 text-blue-700',
  'Голосование': 'bg-amber-100 text-amber-700',
  'Инфраструктура': 'bg-orange-100 text-orange-700',
  'Общение': 'bg-green-100 text-green-700',
};

export default function Forum() {
  const [selected, setSelected] = useState<number | null>(null);

  const topic = topics.find((t) => t.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      {selected && topic ? (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <Icon name="ArrowLeft" size={16} /> Назад к темам
          </button>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${catColors[topic.cat] || 'bg-secondary text-secondary-foreground'}`}>{topic.cat}</span>
              <span className="text-xs text-muted-foreground">{topic.date}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{topic.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="User" size={14} /> {topic.author}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              Уважаемые члены кооператива, прошу рассмотреть данный вопрос на ближайшем заседании. Буду рад услышать ваше мнение.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="font-semibold text-foreground text-sm">{topic.replies} ответов</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                  {['ИВ', 'ПР', 'МС'][i - 1]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">{['Иванова В.', 'Председатель', 'Морозова С.'][i - 1]} · {['2 дня назад', '1 день назад', 'сегодня'][i - 1]}</p>
                  <p className="text-sm text-muted-foreground">Согласен с поднятым вопросом. Предлагаю вынести его на следующее собрание.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-card border border-border rounded-xl p-4 space-y-3">
            <textarea
              placeholder="Написать ответ..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity">Ответить</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Форум</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Обсуждения и вопросы членов кооператива</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <Icon name="MessageSquarePlus" size={16} />
              Новая тема
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-muted/60 border-b border-border text-xs text-muted-foreground font-medium uppercase tracking-wide">
              <div className="col-span-7">Тема</div>
              <div className="col-span-2 text-center hidden sm:block">Ответы</div>
              <div className="col-span-3 hidden md:block">Последний ответ</div>
            </div>
            <div className="divide-y divide-border">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className="w-full grid grid-cols-12 gap-2 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="col-span-7 flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon name={t.hot ? 'Flame' : 'MessageSquare'} size={16} className={t.hot ? 'text-orange-500' : 'text-muted-foreground'} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm leading-snug">{t.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${catColors[t.cat] || 'bg-secondary text-secondary-foreground'}`}>{t.cat}</span>
                        <span className="text-xs text-muted-foreground">{t.author} · {t.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm text-muted-foreground hidden sm:flex items-center justify-center">
                    <span className="font-semibold text-foreground">{t.replies}</span>
                  </div>
                  <div className="col-span-3 text-xs text-muted-foreground hidden md:flex items-center">
                    <Icon name="User" size={12} className="mr-1 flex-shrink-0" />
                    {t.lastReply}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
