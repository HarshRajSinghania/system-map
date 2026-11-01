-- Print the database's real structure as one JSON document.
select json_build_object(
  'tables', coalesce((select json_agg(t order by t.schema, t.name) from (
    select
      n.nspname as schema,
      c.relname as name,
      c.relrowsecurity as rls,
      (select json_agg(json_build_object(
          'name', a.attname,
          'type', format_type(a.atttypid, a.atttypmod),
          'nullable', not a.attnotnull,
          'has_default', a.atthasdef) order by a.attnum)
        from pg_attribute a
        where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped) as columns,
      (select json_agg(json_build_object(
          'name', con.conname,
          'kind', con.contype,
          'columns', (select json_agg(a.attname order by k.ord)
            from unnest(con.conkey) with ordinality k(attnum, ord)
            join pg_attribute a on a.attrelid = con.conrelid and a.attnum = k.attnum),
          'references', case when con.contype = 'f' then
            (select n2.nspname || '.' || c2.relname from pg_class c2
              join pg_namespace n2 on n2.oid = c2.relnamespace where c2.oid = con.confrelid) end,
          'reference_columns', case when con.contype = 'f' then
            (select json_agg(a.attname order by k.ord)
              from unnest(con.confkey) with ordinality k(attnum, ord)
              join pg_attribute a on a.attrelid = con.confrelid and a.attnum = k.attnum) end,
          'on_delete', con.confdeltype,
          'on_update', con.confupdtype,
          'definition', pg_get_constraintdef(con.oid)) order by con.conname)
        from pg_constraint con
        where con.conrelid = c.oid and con.contype in ('p', 'u', 'f', 'c', 'x')) as constraints,
      (select json_agg(json_build_object(
          'name', ic.relname,
          'unique', i.indisunique,
          'partial', i.indpred is not null,
          'constraint', exists (select 1 from pg_constraint x where x.conindid = i.indexrelid),
          'columns', (select json_agg(pg_get_indexdef(i.indexrelid, k, true) order by k)
            from generate_series(1, i.indnkeyatts) k)) order by ic.relname)
        from pg_index i join pg_class ic on ic.oid = i.indexrelid
        where i.indrelid = c.oid) as indexes,
      (select json_agg(json_build_object(
          'name', p.polname,
          'command', p.polcmd,
          'roles', coalesce((select json_agg(r.rolname order by r.rolname)
            from pg_roles r where r.oid = any(p.polroles)), '["public"]'::json)) order by p.polname)
        from pg_policy p where p.polrelid = c.oid) as policies,
      (select json_agg(json_build_object(
          'name', tr.tgname,
          'timing', case when tr.tgtype & 2 <> 0 then 'before'
                         when tr.tgtype & 64 <> 0 then 'instead of' else 'after' end,
          'events', array_remove(array[
            case when tr.tgtype & 4 <> 0 then 'insert' end,
            case when tr.tgtype & 8 <> 0 then 'delete' end,
            case when tr.tgtype & 16 <> 0 then 'update' end,
            case when tr.tgtype & 32 <> 0 then 'truncate' end], null),
          'function', (select pn.nspname || '.' || pr.proname from pg_proc pr
            join pg_namespace pn on pn.oid = pr.pronamespace where pr.oid = tr.tgfoid))
          order by tr.tgname)
        from pg_trigger tr where tr.tgrelid = c.oid and not tr.tgisinternal) as triggers
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p')
      and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
  ) t), '[]'::json),
  'types', coalesce((select json_agg(e order by e.name) from (
    select n.nspname || '.' || t.typname as name,
      (select json_agg(l.enumlabel order by l.enumsortorder)
        from pg_enum l where l.enumtypid = t.oid) as labels
    from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typtype = 'e' and n.nspname = 'public'
  ) e), '[]'::json)
);
