# Supabase Kurulum ve Veritabanı Migration Dokümantasyonu

## 1. Gerekli Paketlerin Kurulumu

### 1.1 Supabase ve İlgili Paketlerin Kurulumu
```bash
# Supabase client ve gerekli paketlerin kurulumu
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

# Supabase CLI kurulumu
npm install supabase --save-dev

# Migration için gerekli paketler
npm install dotenv ts-node --save-dev
```

## 2. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. Proje detaylarını doldurun:
   - Organization: Organizasyonunuzu seçin
   - Name: "mysticMind" (veya istediğiniz bir isim)
   - Database Password: Güvenli bir şifre belirleyin
   - Region: Size en yakın bölgeyi seçin
4. "Create new project" butonuna tıklayın

## 3. Proje Yapılandırması

### 3.1 Environment Variables
`.env` dosyası oluşturun ve Supabase bilgilerinizi ekleyin:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3.2 Supabase Client Yapılandırması
`lib/supabase.ts` dosyasını oluşturun ve Supabase client yapılandırmasını ekleyin.

## 4. Veritabanı Migration Kurulumu

### 4.1 Supabase CLI Başlatma
```bash
# Supabase projesini başlat
npx supabase init
```

### 4.2 Supabase CLI ile Giriş
```bash
# Supabase CLI'a giriş yap
npx supabase login
```

### 4.3 Proje Linkleme
1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. Projenizi seçin
3. Sol menüden "Project Settings" seçeneğine tıklayın
4. "General" sekmesinde "Reference ID" değerini kopyalayın
5. Aşağıdaki komutu çalıştırın (REFERENCE_ID yerine kopyaladığınız ID'yi yazın):
```bash
npx supabase link --project-ref REFERENCE_ID
```

## 5. Migration Dosyalarının Oluşturulması

### 5.1 Migration Klasörü Oluşturma
```bash
# Migration klasörünü oluştur
mkdir -p supabase/migrations
```

### 5.2 Migration Dosyası Oluşturma
`supabase/migrations` klasörü altında timestamp ile başlayan SQL dosyası oluşturun:
```bash
# Yeni migration dosyası oluştur
npx supabase migration new migration_name
```

## 6. Migration'ı Çalıştırma

### 6.1 Migration'ı Push Etme
```bash
# Migration'ı Supabase'e push et
npx supabase db push
```

### 6.2 Migration Durumunu Kontrol Etme
```bash
# Migration durumunu kontrol et
npx supabase db status
```

## 7. Veritabanı Yapısını Kontrol Etme

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. Projenizi seçin
3. Sol menüden "Table Editor" seçeneğine tıklayın
4. Oluşturulan tabloları ve yapılarını kontrol edin

## 8. Yeni Migration Oluşturma

Yeni bir migration oluşturmak için:
```bash
# Yeni migration oluştur
npx supabase migration new migration_name
```

## 9. Migration'ı Geri Alma

Gerekirse migration'ı geri almak için:
```bash
# Migration'ı geri al
npx supabase db reset
```

## 10. Önemli Notlar

1. Her migration dosyası benzersiz bir timestamp ile başlamalıdır
2. Migration dosyaları sıralı bir şekilde çalıştırılır
3. Migration'ları geri almak veri kaybına neden olabilir
4. Production ortamında migration'ları dikkatli bir şekilde yönetin
5. Migration dosyalarını git ile versiyon kontrolü altında tutun

## 11. Hata Durumunda

1. Supabase CLI'ın güncel olduğundan emin olun
2. Doğru proje referansı ile linklendiğinden emin olun
3. Migration dosyalarının doğru formatta olduğunu kontrol edin
4. Supabase Dashboard'dan SQL Editor'ü kullanarak manuel kontrol yapın 