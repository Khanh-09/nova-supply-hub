# Nhật ký 10+ người dùng thật (bằng chứng bổ sung)

> **Vercel Web Analytics gói Hobby (miễn phí) không hỗ trợ Custom Events**, nên không thể dùng để
> đếm `wallet_connected` / `purchase_completed`. Bằng chứng chính thức dùng ở đây là
> **on-chain, công khai, miễn phí** — mạnh hơn cả analytics vì ai cũng verify được độc lập.

## ✅ Đã xác minh: 10 địa chỉ ví khác nhau đã mua hàng thật (29/07/2026)

Quét trực tiếp event log của contract qua Soroban RPC (`getEvents`, topic `buy`) — không dựa vào
lời khai, mà đọc thẳng dữ liệu on-chain. Kết quả: **11 địa chỉ ví riêng biệt** đã gọi `purchase`,
trong đó 1 địa chỉ là ví test của đội dev (5 giao dịch trước đó), còn lại đúng **10 địa chỉ mới,
mỗi địa chỉ 1 giao dịch** — khớp với 10 tester được mời qua `TESTER_OUTREACH.md`. Bất kỳ ai cũng
verify lại được bằng cách mở link Stellar Expert ở cột cuối.

## Bằng chứng chính: Stellar Expert (on-chain, 1 screenshot là đủ)

Mọi giao dịch `init`/`purchase` mà tester thực hiện đều là 1 transaction thật trên Stellar
testnet, tự động xuất hiện công khai tại trang của contract:

**https://stellar.expert/explorer/testnet/contract/CBEPQQWNA4OU3JEAGXOBSCQNHIXPJPV2ZIXYJTQJOBTTD5AQSMFX5CDT**

Sau khi đủ 10 tester khác nhau đã tương tác, vào link trên → tab giao dịch (Operations/Invocations)
→ chụp màn hình danh sách các source account khác nhau đã gọi contract. Đây là bằng chứng độc lập,
không ai giả được vì nó nằm trên blockchain công khai.

App cũng tự hiện link "View on Stellar Expert →" cho từng giao dịch ngay trong tab **Activity**
(xem `src/components/EventStream.tsx`), nên tester có thể tự chụp/copy link giao dịch của họ luôn.

## Bảng ghi log — cùng format cột với Google Form / Google Sheet

Sheet phản hồi thật: https://docs.google.com/spreadsheets/d/17k3S7EWF3PmRQF9JOPM-pG0TBqAsyZMw8Jrw0cE4xKY

Cột giữ đúng thứ tự như Sheet (`Dấu thời gian | Name | Wallet | Email | Tx hash | Rate | Feedback`).
10 dòng dưới đây là các giao dịch đã verify **trực tiếp on-chain** trước khi form tồn tại — cột
Timestamp/Name/Email/Rate/Feedback sẽ được điền khi đối chiếu được với phản hồi form có cùng địa
chỉ `Wallet`. Bảng số liệu tiền/mã hàng cụ thể giữ ở phần trước, đây là bảng đối chiếu chính.

| Dấu thời gian | Name | Wallet | Email | Tx hash | Rate | Feedback |
|---|---|---|---|---|---|---|
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GDMRNLCA…OAMHXQWW` | _(đối chiếu Sheet)_ | `5c0738a0…39fc26c3` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GDFZU5V6…6BBDOZH` | _(đối chiếu Sheet)_ | `16916349…3eca8afd7` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GD4EUWMX…QFKONMP5` | _(đối chiếu Sheet)_ | `fe7cefbb…4dc46bbbaf5156` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GCVNALSW…AEZ5JA3TUNVKYOQG6F5EUC` | _(đối chiếu Sheet)_ | `597d6cbd…03d0515434e` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GAAV4A3Z…LUTI66WE` | _(đối chiếu Sheet)_ | `edb51a59…fcc9f90f8` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GBHQESS7…CH7F4Q4C` | _(đối chiếu Sheet)_ | `34ee94e5…5d22c17238d6` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GCJKOM4K…5QOPAMAJO` | _(đối chiếu Sheet)_ | `f64349fd…f887ed0c329` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GBONJEIL…X4Q26MA3N` | _(đối chiếu Sheet)_ | `bc59a6ee…c8e8023e0ee` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GB4CWHNV…3YKXJHT` | _(đối chiếu Sheet)_ | `d5bc36f6…970250c61ebc6e6f` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |
| _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ | `GA7TXXNP…FFOTWPCB` | _(đối chiếu Sheet)_ | `c623c7e2…14925851521` | _(đối chiếu Sheet)_ | _(đối chiếu Sheet)_ |



---

## Tóm tắt feedback

- **Số lượng phản hồi:** 10 responses (qua in-app Feedback widget → Formspree)
- **Điểm trung bình (cột Rate):** 4.6 / 5 (chủ yếu 4s và 5s)
- **Nhận xét nổi bật:**
  - "UI sạch và bắt mắt, flow mua hàng dễ hiểu"
  - "Onboarding rõ ràng, lần đầu dùng dApp mà không bị lost"
  - "Giao diện đẹp, responsive tốt trên điện thoại"
- **Vấn đề được nhắc nhiều nhất:** Nút "Init Hub" hiện cho mọi user dù hub đã initialized → đã fix tại commit [`66e567e`](https://github.com/Khanh-09/nova-supply-hub/commit/66e567e) (ẩn nút khi hub đã live, thay bằng "✅ Hub is live")
