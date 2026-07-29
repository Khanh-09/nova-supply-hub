# Nhật ký 10+ người dùng thật (bằng chứng bổ sung)

> **Vercel Web Analytics gói Hobby (miễn phí) không hỗ trợ Custom Events**, nên không thể dùng để
> đếm `wallet_connected` / `purchase_completed`. Bằng chứng chính thức dùng ở đây là
> **on-chain, công khai, miễn phí** — mạnh hơn cả analytics vì ai cũng verify được độc lập.

## Bằng chứng chính: Stellar Expert (on-chain, 1 screenshot là đủ)

Mọi giao dịch `init`/`purchase` mà tester thực hiện đều là 1 transaction thật trên Stellar
testnet, tự động xuất hiện công khai tại trang của contract:

**https://stellar.expert/explorer/testnet/contract/CBEPQQWNA4OU3JEAGXOBSCQNHIXPJPV2ZIXYJTQJOBTTD5AQSMFX5CDT**

Sau khi đủ 10 tester khác nhau đã tương tác, vào link trên → tab giao dịch (Operations/Invocations)
→ chụp màn hình danh sách các source account khác nhau đã gọi contract. Đây là bằng chứng độc lập,
không ai giả được vì nó nằm trên blockchain công khai.

App cũng tự hiện link "View on Stellar Expert →" cho từng giao dịch ngay trong tab **Activity**
(xem `src/components/EventStream.tsx`), nên tester có thể tự chụp/copy link giao dịch của họ luôn.

## Bảng ghi log chi tiết (không bắt buộc, chỉ để dễ đối chiếu)

Điền sau khi mỗi tester làm theo hướng dẫn ở [`TESTER_OUTREACH.md`](./TESTER_OUTREACH.md). Cột
"Link Stellar Expert" lấy từ tab Activity trong app hoặc từ trang contract ở trên.

| # | Tên/Nickname tester | Địa chỉ ví (rút gọn, vd: GBOR…G2AF) | Hành động | Link Stellar Expert | Ngày |
|---|----------------------|--------------------------------------|-----------|----------------------|------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| 7 | | | | | |
| 8 | | | | | |
| 9 | | | | | |
| 10 | | | | | |

---

## Tóm tắt feedback (điền sau khi có phản hồi qua Formspree)

- Số lượng phản hồi:
- Điểm trung bình (1-5 sao):
- Nhận xét nổi bật (2-3 câu trích dẫn tiêu biểu):
- Vấn đề được nhắc nhiều nhất:
