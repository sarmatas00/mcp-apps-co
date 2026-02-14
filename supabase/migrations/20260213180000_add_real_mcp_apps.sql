-- Migration: Add real MCP apps data
-- Created: 2026-02-13

-- Insert developers
INSERT INTO developers (id, name, email, github_username, bio, avatar_url, website, is_verified) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Anthropic', 'mcp@anthropic.com', 'anthropic', 'Building Claude and the Model Context Protocol', 'https://avatars.githubusercontent.com/u/53303', 'https://anthropic.com', true),
  ('22222222-2222-2222-2222-222222222222', 'Brave Software', 'mcp@brave.com', 'brave', 'Privacy-focused browser and search', 'https://avatars.githubusercontent.com/u/123456', 'https://brave.com', true),
  ('33333333-3333-3333-3333-333333333333', 'Exa Labs', 'hello@exa.ai', 'exa-labs', 'AI-native search engine', 'https://avatars.githubusercontent.com/u/789012', 'https://exa.ai', true),
  ('44444444-4444-4444-4444-444444444444', 'GitHub', 'mcp@github.com', 'github', 'The world''s leading software development platform', 'https://avatars.githubusercontent.com/u/9919', 'https://github.com', true),
  ('55555555-5555-5555-5555-555555555555', 'Notion Labs', 'mcp@notion.so', 'notion', 'All-in-one workspace', 'https://avatars.githubusercontent.com/u/1234567', 'https://notion.so', true),
  ('66666666-6666-6666-6666-666666666666', 'Slack Technologies', 'mcp@slack.com', 'slack', 'Business communication platform', 'https://avatars.githubusercontent.com/u/2345678', 'https://slack.com', true),
  ('66666666-6666-6666-6666-666666666667', 'Figma', 'mcp@figma.com', 'figma', 'Collaborative interface design tool', 'https://avatars.githubusercontent.com/u/3456789', 'https://figma.com', true),
  ('66666666-6666-6666-6666-666666666668', 'Stripe', 'mcp@stripe.com', 'stripe', 'Financial infrastructure platform', 'https://avatars.githubusercontent.com/u/4567890', 'https://stripe.com', true),
  ('66666666-6666-6666-6666-666666666669', 'Supabase', 'mcp@supabase.com', 'supabase', 'Open source Firebase alternative', 'https://avatars.githubusercontent.com/u/54469796', 'https://supabase.com', true),
  ('66666666-6666-6666-6666-666666666670', 'Vercel', 'mcp@vercel.com', 'vercel', 'Frontend cloud platform', 'https://avatars.githubusercontent.com/u/14985020', 'https://vercel.com', true),
  ('66666666-6666-6666-6666-666666666671', 'Google', 'mcp@google.com', 'google', 'Technology company', 'https://avatars.githubusercontent.com/u/1342004', 'https://google.com', true),
  ('66666666-6666-6666-6666-666666666672', 'Puppeteer', 'mcp@pptr.dev', 'puppeteer', 'Headless Chrome Node.js API', 'https://avatars.githubusercontent.com/u/6906519', 'https://pptr.dev', true),
  ('66666666-6666-6666-6666-666666666673', 'AWS Labs', 'mcp@aws.amazon.com', 'aws', 'Cloud computing services', 'https://avatars.githubusercontent.com/u/2232217', 'https://aws.amazon.com', true),
  ('66666666-6666-6666-6666-666666666674', 'MongoDB', 'mcp@mongodb.com', 'mongodb', 'Document database', 'https://avatars.githubusercontent.com/u/45120', 'https://mongodb.com', true),
  ('66666666-6666-6666-6666-666666666675', 'Redis', 'mcp@redis.io', 'redis', 'In-memory data structure store', 'https://avatars.githubusercontent.com/u/1529926', 'https://redis.io', true)
ON CONFLICT (id) DO NOTHING;

-- Insert apps
INSERT INTO apps (
  id, name, slug, tagline, description, long_description,
  screenshot_urls, github_url, npm_package, category_id,
  compatibility_claude, compatibility_chatgpt, compatibility_vscode, compatibility_goose,
  rating, review_count, install_count, developer_id,
  is_featured, is_verified, is_published,
  config_template_claude, config_template_vscode
) VALUES
  -- Filesystem (Data Access)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
   'Filesystem', 'filesystem',
   'Access and manage local files securely',
   'Secure filesystem access for reading, writing, and managing local files.',
   'The Filesystem MCP server provides secure access to your local file system. It allows Claude to read files, write content, create directories, and manage file metadata. All operations require explicit user permission, ensuring your data remains secure while enabling powerful file management workflows.',
   ARRAY['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
   '@modelcontextprotocol/server-filesystem',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.9, 128, 15420,
   '11111111-1111-1111-1111-111111111111',
   true, true, true,
   '{"mcpServers": {"filesystem": {"command": "npx", "args": ["@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]}}}'::jsonb,
   '{"mcp.servers": [{"name": "filesystem", "command": "npx", "args": ["@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]}]}'::jsonb
  ),

  -- Fetch (Web Access)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
   'Fetch', 'fetch',
   'Fetch web content with intelligent extraction',
   'Fetch and process web content with automatic content extraction and formatting.',
   'The Fetch MCP server enables Claude to retrieve and process web content intelligently. It handles various content types, extracts readable text from HTML, and formats it for optimal LLM consumption. Perfect for research, documentation lookup, and staying current with web-based information.',
   ARRAY['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
   '@modelcontextprotocol/server-fetch',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.8, 96, 12350,
   '11111111-1111-1111-1111-111111111111',
   true, true, true,
   '{"mcpServers": {"fetch": {"command": "npx", "args": ["@modelcontextprotocol/server-fetch"]}}}'::jsonb,
   '{"mcp.servers": [{"name": "fetch", "command": "npx", "args": ["@modelcontextprotocol/server-fetch"]}]}'::jsonb
  ),

  -- PostgreSQL (Database)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 
   'PostgreSQL', 'postgresql',
   'Query and manage PostgreSQL databases',
   'Full-featured PostgreSQL integration for database queries, schema exploration, and management.',
   'The PostgreSQL MCP server provides comprehensive database access with read-only query capabilities. Connect to any PostgreSQL database to explore schemas, execute queries, analyze data, and generate insights. Features connection pooling, query optimization hints, and secure credential management.',
   ARRAY['https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
   '@modelcontextprotocol/server-postgres',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.7, 84, 9870,
   '11111111-1111-1111-1111-111111111111',
   true, true, true,
   '{"mcpServers": {"postgres": {"command": "npx", "args": ["@modelcontextprotocol/server-postgres", "postgresql://user:pass@host/db"]}}}'::jsonb,
   '{"mcp.servers": [{"name": "postgres", "command": "npx", "args": ["@modelcontextprotocol/server-postgres", "postgresql://user:pass@host/db"]}]}'::jsonb
  ),

  -- SQLite (Database)
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 
   'SQLite', 'sqlite',
   'Lightweight SQLite database access',
   'Query and manage SQLite databases with full SQL support.',
   'The SQLite MCP server offers lightweight database capabilities perfect for local development, testing, and small-scale applications. Query local SQLite files, explore schemas, and analyze data without the overhead of a full database server.',
   ARRAY['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
   '@modelcontextprotocol/server-sqlite',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.6, 62, 7430,
   '11111111-1111-1111-1111-111111111111',
   false, true, true,
   '{"mcpServers": {"sqlite": {"command": "npx", "args": ["@modelcontextprotocol/server-sqlite", "/path/to/database.db"]}}}'::jsonb,
   '{"mcp.servers": [{"name": "sqlite", "command": "npx", "args": ["@modelcontextprotocol/server-sqlite", "/path/to/database.db"]}]}'::jsonb
  ),

  -- Brave Search
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 
   'Brave Search', 'brave-search',
   'Privacy-focused web search',
   'Search the web using Brave''s privacy-preserving search engine.',
   'Integrate Brave Search into your AI workflows for privacy-focused web search. Get search results, news, and answers without tracking. Requires a Brave Search API key.',
   ARRAY['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
   '@modelcontextprotocol/server-brave-search',
   (SELECT id FROM categories WHERE slug = 'communication'),
   true, true, false, true,
   4.8, 115, 14200,
   '22222222-2222-2222-2222-222222222222',
   true, true, true,
   '{"mcpServers": {"brave-search": {"command": "npx", "args": ["@modelcontextprotocol/server-brave-search"], "env": {"BRAVE_API_KEY": "your-api-key"}}}}'::jsonb,
   '{"mcp.servers": [{"name": "brave-search", "command": "npx", "args": ["@modelcontextprotocol/server-brave-search"], "env": {"BRAVE_API_KEY": "your-api-key"}}]}'::jsonb
  ),

  -- GitHub
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 
   'GitHub', 'github',
   'Full GitHub integration for repositories, issues, and PRs',
   'Access GitHub repositories, manage issues, create pull requests, and more.',
   'The official GitHub MCP server provides comprehensive GitHub integration. Search repositories, read code, manage issues and pull requests, view commits, and interact with the full GitHub API through natural language. Perfect for code review, repository management, and development workflows.',
   ARRAY['https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=500&fit=crop'],
   'https://github.com/github/github-mcp-server',
   '@github/mcp-server',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.9, 234, 25600,
   '44444444-4444-4444-4444-444444444444',
   true, true, true,
   '{"mcpServers": {"github": {"command": "npx", "args": ["@github/mcp-server"], "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"}}}}'::jsonb,
   '{"mcp.servers": [{"name": "github", "command": "npx", "args": ["@github/mcp-server"], "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"}}]}'::jsonb
  ),

  -- Notion
  ('33333333-3333-3333-3333-333333333334', 
   'Notion', 'notion',
   'Access and manage Notion workspaces',
   'Read pages, databases, and create content in your Notion workspace.',
   'The Notion MCP server connects Claude to your Notion workspace. Read page content, query databases, create new pages, and update existing content. Perfect for knowledge management, documentation, and collaborative workflows.',
   ARRAY['https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop'],
   'https://github.com/makenotion/notion-mcp-server',
   '@notionhq/notion-mcp-server',
   (SELECT id FROM categories WHERE slug = 'productivity'),
   true, true, false, true,
   4.7, 89, 11200,
   '55555555-5555-5555-5555-555555555555',
   true, true, true,
   '{"mcpServers": {"notion": {"command": "npx", "args": ["@notionhq/notion-mcp-server"], "env": {"NOTION_TOKEN": "your-token"}}}}'::jsonb,
   '{"mcp.servers": [{"name": "notion", "command": "npx", "args": ["@notionhq/notion-mcp-server"], "env": {"NOTION_TOKEN": "your-token"}}]}'::jsonb
  ),

  -- Slack
  ('55555555-5555-5555-5555-555555555556', 
   'Slack', 'slack',
   'Send messages and interact with Slack workspaces',
   'Send messages to channels, read conversations, and manage your Slack workspace.',
   'The Slack MCP server enables Claude to interact with your Slack workspaces. Send messages to channels, read thread conversations, search messages, and manage workspace interactions. Great for team communication and automated notifications.',
   ARRAY['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
   '@modelcontextprotocol/server-slack',
   (SELECT id FROM categories WHERE slug = 'communication'),
   true, false, false, true,
   4.5, 67, 8900,
   '66666666-6666-6666-6666-666666666666',
   false, true, true,
   '{"mcpServers": {"slack": {"command": "npx", "args": ["@modelcontextprotocol/server-slack"], "env": {"SLACK_BOT_TOKEN": "xoxb-your-token", "SLACK_TEAM_ID": "T01234567"}}}}'::jsonb,
   NULL
  ),

  -- Figma
  ('22222222-2222-2222-2222-222222222223', 
   'Figma', 'figma',
   'Access Figma designs and files',
   'Read Figma files, extract design tokens, and analyze designs.',
   'The Figma MCP server allows Claude to access your Figma files and designs. Read file contents, extract design specifications, analyze components, and get design token information. Perfect for design-to-code workflows and design system documentation.',
   ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop'],
   'https://github.com/GLips/Figma-Context-MCP',
   'figma-context-mcp',
   (SELECT id FROM categories WHERE slug = 'creative'),
   true, false, false, true,
   4.6, 54, 6800,
   '66666666-6666-6666-6666-666666666667',
   true, true, true,
   '{"mcpServers": {"figma": {"command": "npx", "args": ["figma-context-mcp"], "env": {"FIGMA_API_KEY": "your-api-key"}}}}'::jsonb,
   NULL
  ),

  -- Stripe
  ('22222222-2222-2222-2222-222222222224', 
   'Stripe', 'stripe',
   'Manage Stripe payments and customers',
   'Query customers, payments, invoices, and manage your Stripe account.',
   'The Stripe MCP server provides access to your Stripe account for payment management, customer queries, invoice generation, and financial data analysis. Perfect for e-commerce applications and financial reporting workflows.',
   ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop'],
   'https://github.com/stripe/stripe-mcp',
   '@stripe/mcp',
   (SELECT id FROM categories WHERE slug = 'utilities'),
   true, false, false, true,
   4.4, 42, 5400,
   '66666666-6666-6666-6666-666666666668',
   false, true, true,
   '{"mcpServers": {"stripe": {"command": "npx", "args": ["@stripe/mcp"], "env": {"STRIPE_SECRET_KEY": "sk_test_..."}}}}'::jsonb,
   NULL
  ),

  -- Supabase
  ('22222222-2222-2222-2222-222222222225', 
   'Supabase', 'supabase',
   'Full Supabase integration with Auth, DB, and Storage',
   'Access Supabase databases, manage auth users, and interact with storage.',
   'The Supabase MCP server provides comprehensive access to your Supabase projects. Query PostgreSQL databases with the full power of Supabase, manage authentication users, interact with storage buckets, and call Edge Functions. The ultimate serverless database companion.',
   ARRAY['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=500&fit=crop'],
   'https://github.com/supabase-community/supabase-mcp',
   '@supabase/mcp-server-supabase',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.8, 103, 13800,
   '66666666-6666-6666-6666-666666666669',
   true, true, true,
   '{"mcpServers": {"supabase": {"command": "npx", "args": ["@supabase/mcp-server-supabase@latest"], "env": {"SUPABASE_ACCESS_TOKEN": "sbp_..."}}}}'::jsonb,
   '{"mcp.servers": [{"name": "supabase", "command": "npx", "args": ["@supabase/mcp-server-supabase@latest"], "env": {"SUPABASE_ACCESS_TOKEN": "sbp_..."}}]}'::jsonb
  ),

  -- Vercel
  ('22222222-2222-2222-2222-222222222226', 
   'Vercel', 'vercel',
   'Deploy and manage Vercel projects',
   'Deploy projects, manage domains, and view deployments on Vercel.',
   'The Vercel MCP server enables Claude to manage your Vercel projects. Deploy applications, manage domains and environment variables, view deployment logs, and analyze performance. Perfect for frontend deployment workflows and DevOps automation.',
   ARRAY['https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=500&fit=crop'],
   'https://github.com/vercel/vercel-mcp',
   '@vercel/mcp',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.7, 78, 10200,
   '66666666-6666-6666-6666-666666666670',
   true, true, true,
   '{"mcpServers": {"vercel": {"command": "npx", "args": ["@vercel/mcp"], "env": {"VERCEL_TOKEN": "your-token"}}}}'::jsonb,
   '{"mcp.servers": [{"name": "vercel", "command": "npx", "args": ["@vercel/mcp"], "env": {"VERCEL_TOKEN": "your-token"}}]}'::jsonb
  ),

  -- Google Calendar
  ('22222222-2222-2222-2222-222222222227', 
   'Google Calendar', 'google-calendar',
   'Manage Google Calendar events and schedules',
   'Create events, list calendars, and manage your Google Calendar.',
   'The Google Calendar MCP server allows Claude to interact with your Google Calendar. Create new events, list upcoming appointments, find available time slots, and manage your schedule. Perfect for productivity and scheduling workflows.',
   ARRAY['https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/gcalendar',
   '@modelcontextprotocol/server-gcalendar',
   (SELECT id FROM categories WHERE slug = 'productivity'),
   true, false, false, true,
   4.3, 38, 4700,
   '66666666-6666-6666-6666-666666666671',
   false, true, true,
   '{"mcpServers": {"gcalendar": {"command": "npx", "args": ["@modelcontextprotocol/server-gcalendar"], "env": {"GOOGLE_CALENDAR_CREDENTIALS": "path/to/credentials.json"}}}}'::jsonb,
   NULL
  ),

  -- Puppeteer
  ('22222222-2222-2222-2222-222222222228', 
   'Puppeteer', 'puppeteer',
   'Browser automation and web scraping',
   'Automate browser actions, take screenshots, and scrape web content.',
   'The Puppeteer MCP server provides browser automation capabilities. Take screenshots, generate PDFs, fill forms, click elements, and extract data from websites. Perfect for testing, monitoring, and web scraping workflows.',
   ARRAY['https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
   '@modelcontextprotocol/server-puppeteer',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.5, 71, 8200,
   '66666666-6666-6666-6666-666666666672',
   false, true, true,
   '{"mcpServers": {"puppeteer": {"command": "npx", "args": ["@modelcontextprotocol/server-puppeteer"]}}}'::jsonb,
   '{"mcp.servers": [{"name": "puppeteer", "command": "npx", "args": ["@modelcontextprotocol/server-puppeteer"]}]}'::jsonb
  ),

  -- AWS
  ('22222222-2222-2222-2222-222222222229', 
   'AWS', 'aws',
   'Access AWS services and resources',
   'Query EC2 instances, S3 buckets, Lambda functions, and more.',
   'The AWS MCP server enables Claude to interact with your AWS account. List EC2 instances, query CloudWatch logs, manage S3 buckets, invoke Lambda functions, and access various AWS services. Essential for cloud infrastructure management.',
   ARRAY['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/aws-kb-retrieval',
   '@modelcontextprotocol/server-aws-kb-retrieval',
   (SELECT id FROM categories WHERE slug = 'monitoring'),
   true, true, true, true,
   4.2, 45, 5900,
   '66666666-6666-6666-6666-666666666673',
   false, true, true,
   '{"mcpServers": {"aws": {"command": "npx", "args": ["@modelcontextprotocol/server-aws-kb-retrieval"], "env": {"AWS_ACCESS_KEY_ID": "your-key", "AWS_SECRET_ACCESS_KEY": "your-secret", "AWS_REGION": "us-east-1"}}}}'::jsonb,
   '{"mcp.servers": [{"name": "aws", "command": "npx", "args": ["@modelcontextprotocol/server-aws-kb-retrieval"], "env": {"AWS_ACCESS_KEY_ID": "your-key", "AWS_SECRET_ACCESS_KEY": "your-secret", "AWS_REGION": "us-east-1"}}]}'::jsonb
  ),

  -- MongoDB
  ('22222222-2222-2222-2222-22222222222a', 
   'MongoDB', 'mongodb',
   'Query and manage MongoDB databases',
   'Full MongoDB integration for document queries and database management.',
   'The MongoDB MCP server provides access to MongoDB databases for document queries, aggregation pipelines, and schema exploration. Perfect for applications using MongoDB as their primary database or for data analysis workflows.',
   ARRAY['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop'],
   'https://github.com/mongodb-labs/mongodb-mcp-server',
   '@mongodb/mcp-server',
   (SELECT id FROM categories WHERE slug = 'developer-tools'),
   true, true, true, true,
   4.4, 52, 6300,
   '66666666-6666-6666-6666-666666666674',
   false, true, true,
   '{"mcpServers": {"mongodb": {"command": "npx", "args": ["@mongodb/mcp-server"], "env": {"MONGODB_URI": "mongodb+srv://..."}}}}'::jsonb,
   '{"mcp.servers": [{"name": "mongodb", "command": "npx", "args": ["@mongodb/mcp-server"], "env": {"MONGODB_URI": "mongodb+srv://..."}}]}'::jsonb
  ),

  -- Redis
  ('22222222-2222-2222-2222-22222222222b', 
   'Redis', 'redis',
   'Access Redis data structures and commands',
   'Query keys, execute Redis commands, and manage your Redis instance.',
   'The Redis MCP server enables Claude to interact with Redis databases. Query keys, execute Redis commands, manage data structures, and monitor cache performance. Perfect for caching workflows, session management, and real-time applications.',
   ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/redis',
   '@modelcontextprotocol/server-redis',
   (SELECT id FROM categories WHERE slug = 'monitoring'),
   true, true, true, true,
   4.3, 41, 5100,
   '66666666-6666-6666-6666-666666666675',
   false, true, true,
   '{"mcpServers": {"redis": {"command": "npx", "args": ["@modelcontextprotocol/server-redis"], "env": {"REDIS_URL": "redis://localhost:6379"}}}}'::jsonb,
   '{"mcp.servers": [{"name": "redis", "command": "npx", "args": ["@modelcontextprotocol/server-redis"], "env": {"REDIS_URL": "redis://localhost:6379"}}]}'::jsonb
  ),

  -- Sequential Thinking
  ('22222222-2222-2222-2222-22222222222c', 
   'Sequential Thinking', 'sequential-thinking',
   'Dynamic problem-solving with structured thinking',
   'Break down complex problems with step-by-step structured thinking.',
   'The Sequential Thinking MCP server helps Claude break down complex problems through structured, step-by-step thinking. It dynamically manages thought processes, allows branching into alternative approaches, and tracks the evolution of ideas. Perfect for complex problem-solving and decision-making workflows.',
   ARRAY['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop'],
   'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
   '@modelcontextprotocol/server-sequentialthinking',
   (SELECT id FROM categories WHERE slug = 'productivity'),
   true, true, true, true,
   4.6, 89, 11500,
   '11111111-1111-1111-1111-111111111111',
   true, true, true,
   '{"mcpServers": {"sequential-thinking": {"command": "npx", "args": ["@modelcontextprotocol/server-sequentialthinking"]}}}'::jsonb,
   '{"mcp.servers": [{"name": "sequential-thinking", "command": "npx", "args": ["@modelcontextprotocol/server-sequentialthinking"]}]}'::jsonb
  )

ON CONFLICT (id) DO NOTHING;

-- Update featured apps count per category
UPDATE categories SET 
  description = CASE slug
    WHEN 'data-visualization' THEN 'Charts, graphs, and data exploration tools'
    WHEN 'developer-tools' THEN 'Code editors, databases, version control, and dev utilities'
    WHEN 'productivity' THEN 'Task management, notes, calendar, and workflow tools'
    WHEN 'creative' THEN 'Design, media, and creative tools'
    WHEN 'communication' THEN 'Chat, email, search, and collaboration tools'
    WHEN 'monitoring' THEN 'System monitoring, analytics, and cloud dashboards'
    WHEN 'documents' THEN 'PDF viewers, editors, and document tools'
    WHEN 'utilities' THEN 'General purpose tools, payments, and utilities'
  END;

-- Insert sample reviews
INSERT INTO reviews (app_id, rating, comment, client_used) VALUES
  ((SELECT id FROM apps WHERE slug = 'filesystem'), 5, 'Incredibly useful for managing my project files directly from Claude!', 'claude'),
  ((SELECT id FROM apps WHERE slug = 'filesystem'), 5, 'Secure and reliable. Love the permission system.', 'vscode'),
  ((SELECT id FROM apps WHERE slug = 'github'), 5, 'Game changer for code reviews and repository management.', 'claude'),
  ((SELECT id FROM apps WHERE slug = 'github'), 4, 'Excellent integration. Wish it had more PR management features.', 'vscode'),
  ((SELECT id FROM apps WHERE slug = 'brave-search'), 5, 'Privacy-focused search is exactly what I needed.', 'claude'),
  ((SELECT id FROM apps WHERE slug = 'supabase'), 5, 'The best database MCP server. Supabase + Claude is powerful.', 'vscode'),
  ((SELECT id FROM apps WHERE slug = 'notion'), 4, 'Great for knowledge management. Some limitations with complex databases.', 'claude'),
  ((SELECT id FROM apps WHERE slug = 'sequential-thinking'), 5, 'This transformed how I solve complex problems with AI.', 'claude')
ON CONFLICT DO NOTHING;

-- Update review counts on apps
UPDATE apps SET review_count = (
  SELECT COUNT(*) FROM reviews WHERE reviews.app_id = apps.id
);
