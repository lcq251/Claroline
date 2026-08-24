# 修复：mindme_markdown 资源创建 500（缺 uuid 列）

## Premises（前提）
**业务问题**：用户创建 mindme_markdown 资源时 `POST /resources/{uuid}` 500。
**根因（已定位）**：`Version20260816000000` 建 `claro_mindme_markdown` 表时漏了 `uuid` 列。而 `MindmeMarkdown extends AbstractResource`（基类 `use Id; use Uuid;`）→ Doctrine INSERT 必写 uuid → 表无该列 → `SQLSTATE[42S22]: Unknown column 'uuid' in INSERT`。
对比：`claro_mindme_ai_lesson` 表（Version20260717131158 建）有 `uuid VARCHAR(36) NOT NULL + UNIQUE INDEX`，所以 ai_lesson 创建正常。

**验收**：创建 mindme_markdown 资源 201；打开能读到 content；刷新列表可见。

## 修复方案
1. **现有 DB（dev001）**：补 `claro_mindme_markdown` 表 uuid 列，存量行填 UUID，加 UNIQUE INDEX + NOT NULL。
2. **源码迁移（新建环境）**：修 `Version20260816000000.php` 的 CREATE TABLE 加 uuid 列 + 索引。

## 任务清单
### Task 1：补 DB 表 uuid 列（dev001）
```sql
ALTER TABLE claro_mindme_markdown ADD COLUMN uuid VARCHAR(36) NULL AFTER id;
UPDATE claro_mindme_markdown SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE claro_mindme_markdown MODIFY uuid VARCHAR(36) NOT NULL;
ALTER TABLE claro_mindme_markdown ADD UNIQUE INDEX UNIQ_MD_UUID (uuid);
```
验证：`SHOW COLUMNS FROM claro_mindme_markdown` 有 uuid ✓；`SELECT id,uuid FROM claro_mindme_markdown` 无 NULL。
⚠️ 用 MySQL `UUID()` 生成（36 位匹配 UUID trait 格式）。

### Task 2：修迁移源码
`Version20260816000000.php` 的 CREATE TABLE 改为：
```sql
CREATE TABLE claro_mindme_markdown (
    id INT AUTO_INCREMENT NOT NULL,
    uuid VARCHAR(36) NOT NULL,
    content LONGTEXT DEFAULT NULL,
    resourceNode_id INT DEFAULT NULL,
    UNIQUE INDEX UNIQ_MD_UUID (uuid),
    UNIQUE INDEX UNIQ_MD_RESOURCE_NODE (resourceNode_id),
    PRIMARY KEY(id)
) ...
```
（已装环境不会重跑该迁移，改它只对 fresh install 生效；本环境靠 Task 1 补列。）

### Task 3：验证
```bash
# 创建 markdown 资源（登录 cookie）
curl -b /tmp/c.cookie -X POST http://127.0.0.1/resources/{dir} -H "Content-Type: application/json" -H "X-Requested-With: XMLHttpRequest" \
  -d '{"resourceNode":{"meta":{"type":"mindme_markdown"},"name":"md"},"resource":{"content":"# hi"}}' -w "%{http_code}"
# 期望 201；打开 GET /resources/{node-uuid} 序列化含 content
# 前端刷新看列表出现
```

## 风险
- uuid 补列后 NOT NULL + UNIQUE —— 存量行必须都填上（UPDATE 兜底）。
- 迁移源码改动仅影响 fresh install，安全。

## 验证命令
```bash
docker exec -u www-data -w /var/www/html lamp-claro php bin/console cache:clear --env=prod
docker exec lamp-claro sh -c 'mysql -h database -u root -pdocker dev001 -e "SHOW COLUMNS FROM claro_mindme_markdown"'
```