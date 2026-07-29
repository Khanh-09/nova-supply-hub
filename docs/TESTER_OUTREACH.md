# Mời người dùng thật test Nova Supply Hub

Dùng nội dung dưới đây để mời ít nhất **10 người khác nhau** trải nghiệm demo và để lại bằng chứng
tương tác ví thật (yêu cầu bắt buộc của Level 4).

---

## Tin nhắn mẫu (gửi qua Zalo/Discord/Telegram/nhóm lớp...)

> 👋 Mình đang làm một dApp trên Stellar Soroban (testnet, không tốn tiền thật), rất cần bạn test
> giúp mình trong ~3 phút để hoàn thành yêu cầu "10 người dùng thật" của bài nộp:
>
> 1. Cài ví **Freighter**: https://freighter.app (extension trình duyệt)
> 2. Trong Freighter, chuyển network sang **Testnet** (Settings → Network → Testnet)
> 3. Mở demo: **https://nova-supply-hub.vercel.app**
> 4. Bấm **Connect Freighter Wallet**
> 5. Nếu ví chưa có XLM testnet, bấm nút **Get Freighter / Fund** trong app (dùng Friendbot, miễn phí)
> 6. Thử mua 1 món trong catalog (Confirm & Pay) — chỉ mất vài giây
> 7. Trước khi rời trang, bấm nút **💬 Feedback** ở góc màn hình, cho 1-5 sao + vài dòng nhận xét
>
> Cảm ơn bạn rất nhiều! 🙏

---

## Vì sao chỉ cần gửi tin nhắn này là đủ?

Mỗi lần một người **connect ví thật** hoặc **hoàn tất giao dịch**, app đã tự động gửi sự kiện
(`wallet_connected`, `purchase_completed`, ...) lên **Vercel Analytics** (xem
`src/hooks/useWallet.ts`, `src/hooks/useContract.ts`). Bạn không cần tự ghi chép gì thủ công —
chỉ cần đủ 10 người làm theo các bước trên, rồi vào Vercel Dashboard chụp màn hình số liệu.

Nếu muốn có thêm bằng chứng phụ (ví dụ để show cho ban giám khảo xem chi tiết từng người), dùng
file [`TESTER_LOG.md`](./TESTER_LOG.md) đi kèm để ghi lại link/tx hash mà mỗi tester chia sẻ lại
cho bạn (không bắt buộc, chỉ là thêm uy tín).
