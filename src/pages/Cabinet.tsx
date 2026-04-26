import { useState } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

const API_URL = func2url['member-application'];

/* ── Данные заглушки ── */
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

/* ── Типы анкеты ── */
type FormData = {
  lastName: string; firstName: string; middleName: string;
  phone: string; email: string;
  address: string; addressCity: string; addressPostal: string;
  passportSeries: string; passportNumber: string; passportIssued: string; passportDate: string; passportCode: string;
  moduleName: string; garageNumber: string;
  ownershipCert: string;
  cadastralNumber: string;
};

const emptyForm: FormData = {
  lastName: '', firstName: '', middleName: '',
  phone: '', email: '',
  address: '', addressCity: '', addressPostal: '',
  passportSeries: '', passportNumber: '', passportIssued: '', passportDate: '', passportCode: '',
  moduleName: '', garageNumber: '',
  ownershipCert: '',
  cadastralNumber: '',
};

/* ── Шаги анкеты ── */
const STEPS = [
  { label: 'ФИО', icon: 'User' },
  { label: 'Адрес', icon: 'MapPin' },
  { label: 'Паспорт', icon: 'CreditCard' },
  { label: 'Собственность', icon: 'Home' },
  { label: 'Кадастр', icon: 'Map' },
];

/* ── Поле формы ── */
function Field({
  label, value, onChange, placeholder, hint, mask,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; mask?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? mask ?? ''}
        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ── Компонент анкеты ── */
function RegistrationForm({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof FormData) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const progress = ((step) / STEPS.length) * 100;

  const canNext = (): boolean => {
    if (step === 0) return !!(form.lastName && form.firstName && form.middleName && form.phone);
    if (step === 1) return !!(form.address && form.addressCity);
    if (step === 2) return !!(form.passportSeries && form.passportNumber && form.passportIssued && form.passportDate);
    if (step === 3) return !!(form.moduleName && form.garageNumber && form.ownershipCert);
    if (step === 4) return !!form.cadastralNumber;
    return true;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Icon name="ClipboardList" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Анкета регистрации</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Шаг {step + 1} из {STEPS.length} — {STEPS[step].label}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress + 20}%`, background: 'hsl(38,92%,50%)' }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i < step
                      ? 'bg-green-500 text-white'
                      : i === step
                      ? 'text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  style={i === step ? { background: 'hsl(38,92%,50%)', color: 'hsl(220,40%,10%)' } : {}}
                >
                  {i < step ? <Icon name="Check" size={13} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === step ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-card border border-border rounded-xl p-6 animate-fade-in" key={step}>
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="User" size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">ФИО и контактные данные</h3>
            </div>
            <Field label="Фамилия" value={form.lastName} onChange={set('lastName')} placeholder="Иванов" />
            <Field label="Имя" value={form.firstName} onChange={set('firstName')} placeholder="Иван" />
            <Field label="Отчество" value={form.middleName} onChange={set('middleName')} placeholder="Иванович" />
            <div className="border-t border-border pt-4 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Контактные данные</p>
              <Field
                label="Номер телефона *"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+7 (900) 000-00-00"
                hint="Обязательное поле — для связи по вопросам кооператива"
              />
              <Field
                label="Электронная почта"
                value={form.email}
                onChange={set('email')}
                placeholder="example@mail.ru"
                hint="Необязательно — для получения уведомлений"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="MapPin" size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">Адрес проживания</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Город / Населённый пункт" value={form.addressCity} onChange={set('addressCity')} placeholder="Нижний Новгород" />
              </div>
              <div className="col-span-2">
                <Field label="Улица, дом, квартира" value={form.address} onChange={set('address')} placeholder="ул. Примерная, д. 1, кв. 10" />
              </div>
              <div className="col-span-1">
                <Field label="Почтовый индекс" value={form.addressPostal} onChange={set('addressPostal')} placeholder="603000" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="CreditCard" size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">Паспортные данные</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Серия" value={form.passportSeries} onChange={set('passportSeries')} placeholder="4420" />
              <Field label="Номер" value={form.passportNumber} onChange={set('passportNumber')} placeholder="123456" />
              <div className="col-span-2">
                <Field label="Кем выдан" value={form.passportIssued} onChange={set('passportIssued')} placeholder="МВД России по г. Нижний Новгород" />
              </div>
              <Field label="Дата выдачи" value={form.passportDate} onChange={set('passportDate')} placeholder="01.01.2015" />
              <Field label="Код подразделения" value={form.passportCode} onChange={set('passportCode')} placeholder="520-001" />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-2 items-start">
              <Icon name="Lock" size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">Паспортные данные хранятся в зашифрованном виде и доступны только председателю ГСК.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Home" size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">Гараж и право собственности</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Field
                  label="Наименование модуля *"
                  value={form.moduleName}
                  onChange={set('moduleName')}
                  placeholder="А, Б, В..."
                  hint="Буква или название блока/модуля"
                />
              </div>
              <div className="col-span-1">
                <Field
                  label="Номер гаража *"
                  value={form.garageNumber}
                  onChange={set('garageNumber')}
                  placeholder="147"
                  hint="Порядковый номер бокса"
                />
              </div>
            </div>
            <Field
              label="Номер свидетельства"
              value={form.ownershipCert}
              onChange={set('ownershipCert')}
              placeholder="52-НН 123456"
              hint="Указан в свидетельстве о праве собственности на гараж (верхний правый угол документа)"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-2 items-start">
              <Icon name="Info" size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">Если у вас выписка из ЕГРН вместо свидетельства — укажите номер записи о регистрации.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Map" size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">Кадастровый номер в Росреестре</h3>
            </div>
            <Field
              label="Кадастровый номер"
              value={form.cadastralNumber}
              onChange={set('cadastralNumber')}
              placeholder="52:18:0020001:123"
              hint="Формат: XX:XX:XXXXXXX:XX — указан в выписке из ЕГРН или кадастровом паспорте"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-2 items-start">
              <Icon name="ExternalLink" size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Найти кадастровый номер можно на сайте{' '}
                <a href="https://pkk.rosreestr.ru" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                  pkk.rosreestr.ru
                </a>{' '}
                по адресу гаража.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex gap-2 items-center text-sm text-red-700">
          <Icon name="AlertCircle" size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}
      <div className="flex gap-3 justify-between">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
          >
            <Icon name="ArrowLeft" size={16} /> Назад
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'hsl(38,92%,50%)', color: 'hsl(220,40%,10%)' }}
          >
            Далее <Icon name="ArrowRight" size={16} />
          </button>
        ) : (
          <button
            onClick={async () => {
              setLoading(true);
              setError('');
              try {
                const res = await fetch(API_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    last_name: form.lastName,
                    first_name: form.firstName,
                    middle_name: form.middleName,
                    phone: form.phone,
                    email: form.email || null,
                    address_city: form.addressCity,
                    address_street: form.address,
                    address_postal: form.addressPostal,
                    passport_series: form.passportSeries,
                    passport_number: form.passportNumber,
                    passport_issued: form.passportIssued,
                    passport_date: form.passportDate,
                    passport_code: form.passportCode,
                    module_name: form.moduleName,
                    garage_number: form.garageNumber,
                    ownership_cert: form.ownershipCert,
                    cadastral_number: form.cadastralNumber,
                  }),
                });
                if (!res.ok) {
                  const data = await res.json();
                  setError(data.error || 'Ошибка сервера. Попробуйте ещё раз.');
                } else {
                  onDone();
                }
              } catch {
                setError('Не удалось подключиться к серверу. Проверьте интернет-соединение.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={!canNext() || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Icon name="Loader" size={16} className="animate-spin" /> Отправка...</>
              : <><Icon name="CheckCircle" size={16} /> Отправить анкету</>
            }
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Основной кабинет ── */
export default function Cabinet({ registered = false, onRegistered }: { registered?: boolean; onRegistered?: () => void }) {
  const [tab, setTab] = useState<'info' | 'payments' | 'notifications'>('info');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Icon name="CheckCircle" size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Анкета отправлена!</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Председатель ГСК проверит данные и подтвердит вашу регистрацию в течение 1–2 рабочих дней.
        </p>
        <button
          onClick={() => { setSubmitted(false); onRegistered?.(); setShowForm(false); }}
          className="mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
        >
          Перейти в кабинет
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-2 animate-fade-in">
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <Icon name="ArrowLeft" size={15} /> Отмена
        </button>
        <RegistrationForm onDone={() => setSubmitted(true)} />
      </div>
    );
  }

  if (!registered) {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Личный кабинет</h1>
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center max-w-md mx-auto">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg, hsl(220,55%,18%), hsl(220,50%,28%))' }}
          >
            <Icon name="UserPlus" size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Вы ещё не зарегистрированы</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Для получения доступа к личному кабинету члена ГСК заполните анкету. Это займёт около 3 минут.
          </p>
          <div className="w-full text-left space-y-2 mb-6">
            {[
              'Фамилия, Имя, Отчество',
              'Контактный телефон и e-mail',
              'Адрес проживания',
              'Паспортные данные',
              'Свидетельство права собственности',
              'Кадастровый номер гаража',
            ].map((item, i) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'hsl(38,92%,50%)', color: 'hsl(220,40%,10%)' }}
                >
                  {i + 1}
                </div>
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: 'hsl(38,92%,50%)', color: 'hsl(220,40%,10%)' }}
          >
            Заполнить анкету
          </button>
        </div>
      </div>
    );
  }

  /* ── Зарегистрированный пользователь ── */
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Личный кабинет</h1>

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

      <div className="flex gap-1 border-b border-border">
        {([['info', 'Информация'], ['payments', 'Платежи'], ['notifications', 'Уведомления']] as const).map(([key, label]) => (
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
              {n.unread && <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}