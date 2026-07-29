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

## Bảng ghi log chi tiết (lấy trực tiếp từ event log on-chain, không thủ công)

| # | Địa chỉ ví (rút gọn) | Mua shipment # | Số tiền | Link Stellar Expert (tx) |
|---|------------------------|:---:|---|--------------------------|
| 1 | `GDMRNLCA…OAMHXQWW` | #2 | 0.75 XLM | https://stellar.expert/explorer/testnet/tx/5c0738a01deec3020fcaf0c02f6f47567f4ada3ab9fceddbca678dfd39fc26c3 |
| 2 | `GDFZU5V6…F5V6GEBACT5KBE6BBDOZH` | #1 | 0.40 XLM | https://stellar.expert/explorer/testnet/tx/169163495dc906fd2b851d165789c95a5b4491983ef8949f3f8e57b3eca8afd7 |
| 3 | `GD4EUWMX…QFKONMP5` | #4 | 0.55 XLM | https://stellar.expert/explorer/testnet/tx/fe7cefbb47280737757c1a920f2abf843b10301636010931634dc46bbbaf5156 |
| 4 | `GCVNALSW…F5EUC` | #1 | 0.40 XLM | https://stellar.expert/explorer/testnet/tx/597d6cbd957a3d87912d3d675de64cbf3d7c2207064ae0cc75f2903d0515434e |
| 5 | `GAAV4A3Z…LUTI66WE` | #3 | 0.90 XLM | https://stellar.expert/explorer/testnet/tx/edb51a597908d65a082bb620336233531ca824b025fda58fcc20d6fccc9f90f8 |
| 6 | `GBHQESS7…H7F4Q4C` | #5 | 1.10 XLM | https://stellar.expert/explorer/testnet/tx/34ee94e5034c3286d29a26615974ca94ccc7d616f9dae5420b545d22c17238d6 |
| 7 | `GCJKOM4K…OPAMAJO` | #1 | 0.40 XLM | https://stellar.expert/explorer/testnet/tx/f64349fd2bd8f2032ab69ff7969402fc5924dab16f41b3df9f8aff887ed0c329 |
| 8 | `GBONJEIL…X4Q26MA3N` | #4 | 0.55 XLM | https://stellar.expert/explorer/testnet/tx/bc59a6eed411324aaf004d00d1a51770858fa2decb7a587f2cc63c8e8023e0ee |
| 9 | `GB4CWHNV…3YKXJHT` | #1 | 0.40 XLM | https://stellar.expert/explorer/testnet/tx/d5bc36f6a6aecabd82b24556d779cd8e20f979f427a81ee6970250c61ebc6e6f |
| 10 | `GA7TXXNP…FFOTWPCB` | #2 | 0.75 XLM | https://stellar.expert/explorer/testnet/tx/c623c7e2d87fac31c10bf0590111f779ba95f93fd3ccf77b1f95014925851521 |

*(Địa chỉ ví thứ 11, `GCB4DGIS…ROXNAT`, là ví test của đội dev khi verify fix SDK — không tính vào
10 tester thật ở trên.)*

---

## Tóm tắt feedback (điền sau khi có phản hồi qua Formspree)

- Số lượng phản hồi:
- Điểm trung bình (1-5 sao):
- Nhận xét nổi bật (2-3 câu trích dẫn tiêu biểu):
- Vấn đề được nhắc nhiều nhất:
