import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

const API_URL = func2url['documents'];

const ALL_CATEGORIES = ['Все', 'Устав', 'Протоколы', 'Финансы', 'Договоры', 'Заявления', 'Прочее'];

const ICON_MAP: Record<string, string> = {
  'Устав': 'BookOpen',
  'Протоколы': 'FileText',
  'Финансы': 'BarChart2',
  'Договоры': 'Landmark',
  'Заявления': 'FilePen',
  'Прочее': 'File',
};

type Doc = {
  id: number;
  name: string;
  category: string;
  file_url: string;
  file_size: string;
  uploaded_at: string;
};

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [active, setActive] = useState('Все');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Прочее');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setDocs(data.documents || []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const filtered = docs.filter((d) => {
    const matchCat = active === 'Все' || d.category === active;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    if (!uploadName) setUploadName(file.name.replace(/\.[^.]+$/, ''));
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadName.trim()) {
      setUploadError('Укажите название и выберите файл');
      return;
    }
    setUploadError('');
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploadName.trim(),
          category: uploadCategory,
          file_data: base64,
          file_name: uploadFile!.name,
          content_type: uploadFile!.type || 'application/octet-stream',
        }),
      });
      setUploading(false);
      if (res.ok) {
        setShowModal(false);
        setUploadName('');
        setUploadCategory('Прочее');
        setUploadFile(null);
        fetchDocs();
      } else {
        setUploadError('Ошибка при загрузке. Попробуйте ещё раз.');
      }
    };
    reader.readAsDataURL(uploadFile);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить документ?')) return;
    await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Документы</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Официальные документы кооператива</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setUploadError(''); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Icon name="Upload" size={16} />
          Загрузить документ
        </button>
      </div>

      <div className="relative">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {ALL_CATEGORIES.map((c) => (
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

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <Icon name="Loader" size={32} className="mx-auto mb-3 opacity-40 animate-spin" />
            <p>Загрузка документов...</p>
          </div>
        ) : filtered.length === 0 ? (
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
                        <Icon name={ICON_MAP[d.category] ?? 'File'} size={16} className="text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">{d.category}</span>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden sm:table-cell">{d.uploaded_at}</td>
                  <td className="px-3 py-3.5 text-muted-foreground hidden lg:table-cell">{d.file_size}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3 justify-end">
                      <a
                        href={d.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        <Icon name="Download" size={15} />
                        <span className="hidden sm:inline text-xs">Скачать</span>
                      </a>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground text-lg">Загрузить документ</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Название</label>
                <input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Например: Устав ГСК «ТИТАН»"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Категория</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {ALL_CATEGORIES.filter(c => c !== 'Все').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Файл</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {uploadFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                      <Icon name="FileCheck" size={18} className="text-primary" />
                      {uploadFile.name}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <Icon name="UploadCloud" size={28} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Нажмите для выбора файла</p>
                      <p className="text-xs mt-1">PDF, DOC, XLS и другие</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {uploading ? 'Загрузка...' : 'Загрузить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
