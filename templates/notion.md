# Notion IDs (Research Studio workspace)

The shared parts of the Research Studio. Each study's own tables have their own IDs: take those from
the study page (or `study.json`), never from here.

| What | ID |
|---|---|
| Research Studio hub page | `<NOTION-ID>` |
| Studies data source | `collection://<NOTION-ID>` |
| Study template page (duplicate me) | `<NOTION-ID>` |
| Projects data source | `collection://<NOTION-ID>` |
| Project hub template page (duplicate me) | `<NOTION-ID>` |
| Insights data source | `collection://<NOTION-ID>` |
| Opportunities data source | `collection://<NOTION-ID>` |
| Hypotheses data source | `collection://<NOTION-ID>` |

**Notion gotchas**
- The workspace plan has no query tool, and fetching a table returns its schema, not its rows. Work
  from row pages created or fetched in the session, plus keyword searches of each table.
- Renaming a column and altering it in the same call creates a duplicate column: do them separately.
- Changing a select's options needs every option listed, or the missing ones are removed.
- Upload media with `notion-create-file-upload`, then a multipart POST, then `![](file-upload://id)`
  or `<video src="file-upload://id">`. Unattached uploads expire after about an hour. Set
  `video/mp4` explicitly for videos.
- `notion-file-block://` references copied from one page into another make Notion copy the file.
