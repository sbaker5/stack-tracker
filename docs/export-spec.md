# Export & Backup Specification

## Supported Export Formats
- **Mind Map (PDF)**: Visual export of stack/tag/flag relationships
- **Tiered List (PDF)**: Hierarchical export of stacks/tags/flags
- **Flat Data Table (CSV)**: Tabular export of all stack data
- **JSON**: Full database export (one-click)

## Visibility Controls
- Toggle inclusion of tags, flags, notes in export
- Export only visible/filtered data

## Custom Export Settings
- Select tags/flags/notes to include
- Batch export for multiple stacks
- Export settings persist per session

## Export Format Validation
- Validate export output against schema
- Confirm PDF/CSV structure matches spec
- Automated export tests (see QA)

## Backup/Restore
- Regular automated backups (MongoDB Atlas)
- One-click export/restore (JSON/CSV)
- Backup verification and disaster recovery procedures

---

## Example Export Settings UI
- [ ] Include Tags
- [ ] Include Flags
- [ ] Include Notes
- [ ] Export Format: (Mind Map PDF / Tiered List PDF / CSV / JSON)
- [ ] Export Only Visible Items
- [ ] Batch Export (select stacks)

---

## Batch Export Example
- User selects multiple stacks
- Chooses export format (e.g., CSV)
- System generates single file with all selected stacks

## Validation Checklist
- [ ] All export formats match schema
- [ ] Visibility controls respected
- [ ] Custom settings applied
- [ ] Automated export tests pass
