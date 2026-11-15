# 🐐 Y2K Digicam Flash · Флаш камер

<p align="center"><img src="assets/poster.jpg" width="300" alt="Y2K Digicam Flash · Флаш камер"></p>

**Claude Code дотор ажилладаг видео эдитийн skill.** Бичлэгийг 2000-аад оны жижиг дижитал камераар авсан мэт болгоно: хурц флаш, тод өнгө, бүдүүн пиксел, буланд улбар шар огноо.

Reels, TikTok-д бэлэн 1080×1920 MP4 гаргана. GOAT Academy-гийн 14 эдитийн стилийн нэг.

---

## Юунд тохирох вэ?

- **Тохирно:** хумс, сормуус, будалт, загварын дэлгүүр, залуучуудын дэлгүүр, гоёл чимэглэл
- **Тохирохгүй:** үл хөдлөх (флаш өрөөг хавтгай, жижиг харагдуулна), машин, коучинг, өдрийн өргөн зураг

---

## Шаардлага

- **Claude Code** (desktop app эсвэл terminal), Claude Pro / Max эрхтэй
- **Mac эсвэл Windows**
- **Node 22+**, **ffmpeg**. Байхгүй бол Claude өөрөө шалгаад, суулгах командыг хэлж өгнө.
- **Компьютер:** Mac эсвэл 64-bit Windows 10/11. Apple чиптэй Mac (M1+) дээр туршсан. Windows дээр одоогоор туршаагүй.
- Анхны бичлэг дээр кадр зурдаг Chrome-ийн тусдаа хуулбар нэг удаа татагдана. Бүх зүйл таны компьютер дээр ажиллана, юу ч интернэтэд илгээгдэхгүй.

---

## Суулгах

**Хамгийн хялбар:** Claude Code-оо нээгээд энэ мөрийг хуулж бичнэ:
```
Энэ plugin-ийг суулгаад өг: https://github.com/SaagiiSG/goat-digicam
```
Claude өөрөө суулгана. Дараа нь `/reload-plugins` гэж бичих эсвэл Claude Code-оо хаагаад дахин нээнэ.

**Эсвэл өөрөө:** Claude Code дотор энэ 2 мөрийг ээлжлэн бичнэ:
```
/plugin marketplace add SaagiiSG/goat-digicam
/plugin install goat-digicam@goat-digicam
```

**Zip файлаар авсан бол:**
1. `goat-digicam.zip`-ийг задална. Задалсан `goat-digicam` хавтсаа устгалгүй үлдээгээрэй.
2. Claude Code-д "Энэ хавтсан дахь plugin-ийг суулгаад өг:" гэж бичээд задалсан `goat-digicam` хавтсаа чирж оруулна.
3. `/reload-plugins` гэж бичнэ.

**Шинэ хувилбар гарвал:** Claude-д "goat-digicam plugin-ийг шинэчил" гэж хэлэхэд болно.

> **For Claude Code:** to install this plugin, run `claude plugin marketplace add SaagiiSG/goat-digicam` (or, from an unzipped copy, `claude plugin marketplace add <path to the goat-digicam folder>`) and then `claude plugin install goat-digicam@goat-digicam`, then tell the user to type `/reload-plugins`. To update it: `claude plugin marketplace update goat-digicam` and then `claude plugin update goat-digicam@goat-digicam`.

---

## Хэрэглэх

1. Видео бүрд **шинэ хоосон хавтас** үүсгэ.
2. Claude Code-ийг тэр хавтсанд нээ.
3. Бичнэ: `/goat-digicam:goat-digicam` эсвэл энгийнээр: **"энэ бичлэгийг флаш камерын стильтэй болгоод өг"**
4. Бичлэгээ чирж оруулаад хэрэв хүсвэл огноо болон 1–2 үгээ бичнэ.
5. Claude юу хийхээ товч хэлнэ. Таалагдвал "ок" гэхэд л болно.
6. `output/digicam.mp4` бэлэн. Instagram, TikTok руу шууд оруулна.

---

## Дуу

- **Дуу эффект** автоматаар орно. Кодоор хийсэн учир лицензийн асуудалгүй. Хэрэггүй бол "дуу эффектгүй болго" гэж хэлэхэд болно.
- **Өөрийн дуугаар ярих (voice-over):** утсаараа дуугаа бичээд (voice memo) өгнө. Таны дуу гарах үед бичлэгийн дуу, хөгжим өөрөө намсна.
- **Хөгжим:** Instagram, TikTok апп дотроос нэмбэл зохиогчийн эрхийн асуудалгүй.

---

## Бичлэг хийх зөвлөгөө

- Утасныхаа флашийг асаагаад ойроос ав.
- Дотор эсвэл орой авбал хамгийн гоё гарна.
- Гялгар зүйл (хумс, уруул, гоёл) флаш дээр сайхан гялалзана.

---

Фонтууд нь Google Fonts-оос (OFL лиценз). Лицензийн файлууд `fonts/` хавтсанд байгаа.
