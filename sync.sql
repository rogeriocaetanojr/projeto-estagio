INSERT INTO community."UserMirror" (id, email, "profileType")
SELECT id, email, 'student' FROM auth."User"
ON CONFLICT DO NOTHING;
