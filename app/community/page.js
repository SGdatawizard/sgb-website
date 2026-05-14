'use client'

import { useState, useRef } from 'react'

const CURRENT_USER = { name: 'Demo User', initials: 'DU', id: 'demo' }

const INITIAL_POSTS = [
  {
    id: 1,
    author: { name: 'James Whitfield', initials: 'JW', id: 'jw' },
    timestamp: new Date(Date.now() - 1000 * 60 * 23),
    text: 'Just picked up a beautiful SG 128a at auction last week — the 1933 Falklands 1d black and scarlet. Stunning condition, barely any hinge remnant. Anyone else been following how strong the 1933 Centenary set has been performing lately?',
    image: null,
    likes: 14,
    liked: false,
    comments: [
      { id: 101, author: { name: 'Sarah Chen', initials: 'SC', id: 'sc' }, text: 'Incredible stamp — the 128a is one of my favourites from that series. What did it go for if you don\'t mind me asking?', timestamp: new Date(Date.now() - 1000 * 60 * 18), likes: 3, liked: false },
      { id: 102, author: { name: 'Demo User', initials: 'DU', id: 'demo' }, text: 'I\'ve been tracking the 1933 Centenary for a while now. The whole set has moved significantly since 2005. Really impressive.', timestamp: new Date(Date.now() - 1000 * 60 * 10), likes: 2, liked: false },
    ],
    tags: ['Falklands', '1933 Centenary', 'Auction'],
  },
  {
    id: 2,
    author: { name: 'Margaret Osei', initials: 'MO', id: 'mo' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    text: 'Has anyone had experience getting certificates from BPA or RPSL recently? Wondering about turnaround times for Commonwealth material. I have a few high-value Falklands items I\'d like to get certified before selling.',
    image: null,
    likes: 8,
    liked: false,
    comments: [
      { id: 201, author: { name: 'Robert Finch', initials: 'RF', id: 'rf' }, text: 'BPA has been running about 8-10 weeks for me lately. Worth it for anything over £500 though.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), likes: 5, liked: false },
      { id: 202, author: { name: 'Sarah Chen', initials: 'SC', id: 'sc' }, text: 'RPSL is slightly faster in my experience. Their online tracking has improved a lot too.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), likes: 4, liked: false },
    ],
    tags: ['Certificates', 'BPA', 'RPSL'],
  },
  {
    id: 3,
    author: { name: 'Robert Finch', initials: 'RF', id: 'rf' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    text: 'Interesting piece in the latest Gibbons Stamp Monthly about watermark varieties in the KGVI Falklands definitives. The article makes a compelling case that several "common" varieties are significantly undervalued relative to their scarcity. Would be curious to hear from anyone who specialises in this area.',
    image: null,
    likes: 21,
    liked: false,
    comments: [
      { id: 301, author: { name: 'James Whitfield', initials: 'JW', id: 'jw' }, text: 'I read this too — very interesting. The sideways watermark varieties in particular seem mispriced.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7), likes: 6, liked: false },
      { id: 302, author: { name: 'Margaret Osei', initials: 'MO', id: 'mo' }, text: 'Do you have a link to the digital edition? I\'d love to read the full article.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), likes: 1, liked: false },
      { id: 303, author: { name: 'Demo User', initials: 'DU', id: 'demo' }, text: 'The KGVI Falklands definitives are a fascinating area. So many varieties to chase down.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), likes: 3, liked: false },
    ],
    tags: ['KGVI', 'Falklands', 'Watermarks', 'Varieties'],
  },
  {
    id: 4,
    author: { name: 'Sarah Chen', initials: 'SC', id: 'sc' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    text: 'Just back from the Spring Stampex show in London. A fantastic day — picked up a couple of nice pre-UPU Falklands covers and had some great conversations with dealers. The market for classic Commonwealth seems very buoyant right now. Anyone else go?',
    image: null,
    likes: 31,
    liked: false,
    comments: [
      { id: 401, author: { name: 'Robert Finch', initials: 'RF', id: 'rf' }, text: 'I was there on Saturday! Great show. Did you see the Falklands collection in the frame room?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), likes: 4, liked: false },
    ],
    tags: ['Stampex', 'Shows', 'Commonwealth'],
  },
  {
    id: 5,
    author: { name: 'Demo User', initials: 'DU', id: 'demo' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    text: 'Question for the group — when storing high-value stamps long-term, what\'s the current thinking on albums vs individual mounts in archival boxes? I\'ve been using Leuchtturm albums but wondering if there\'s a better approach for items worth £500+.',
    image: null,
    likes: 12,
    liked: false,
    comments: [
      { id: 501, author: { name: 'James Whitfield', initials: 'JW', id: 'jw' }, text: 'For really valuable items I use individual polyester mounts stored in acid-free boxes in a climate-controlled environment. Albums are fine for general collections though.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 35), likes: 7, liked: false },
      { id: 502, author: { name: 'Margaret Osei', initials: 'MO', id: 'mo' }, text: 'The Leuchtturm albums are good but the Lighthouse Vario pages are even better for high-value material. The mounts are thicker and more protective.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 34), likes: 5, liked: false },
    ],
    tags: ['Storage', 'Collecting', 'Advice'],
  },
]

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return Math.floor(secs / 60) + 'm ago'
  if (secs < 86400) return Math.floor(secs / 3600) + 'h ago'
  return Math.floor(secs / 86400) + 'd ago'
}

function Avatar({ initials, size = 40, bg = '#293451', color = '#fff', fontSize = '14px' }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function Community() {
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [newPostText, setNewPostText] = useState('')
  const [newPostTags, setNewPostTags] = useState('')
  const [newPostImage, setNewPostImage] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [openComments, setOpenComments] = useState({})
  const [commentText, setCommentText] = useState({})
  const [composing, setComposing] = useState(false)
  const fileInputRef = useRef(null)

  function handleImageSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function(ev) {
      setNewPostImage(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setNewPostImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function submitPost() {
    if (!newPostText.trim() && !newPostImage) return
    const tags = newPostTags.split(',').map(t => t.trim()).filter(Boolean)
    const post = { id: Date.now(), author: CURRENT_USER, timestamp: new Date(), text: newPostText.trim(), image: newPostImage, likes: 0, liked: false, comments: [], tags }
    setPosts(prev => [post, ...prev])
    setNewPostText('')
    setNewPostTags('')
    setNewPostImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setComposing(false)
  }

  function toggleLike(postId) {
    setPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }))
  }

  function toggleCommentLike(postId, commentId) {
    setPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, comments: p.comments.map(c => c.id !== commentId ? c : { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }) }))
  }

  function submitComment(postId) {
    const text = (commentText[postId] || '').trim()
    if (!text) return
    const comment = { id: Date.now(), author: CURRENT_USER, text, timestamp: new Date(), likes: 0, liked: false }
    setPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, comments: [...p.comments, comment] }))
    setCommentText(prev => ({ ...prev, [postId]: '' }))
  }

  function toggleComments(postId) {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const myPostIds = new Set(posts.filter(p => p.author.id === CURRENT_USER.id).map(p => p.id))
  const myCommentPostIds = new Set(posts.filter(p => p.comments.some(c => c.author.id === CURRENT_USER.id)).map(p => p.id))

  const filtered = posts.filter(p => {
    if (filter === 'mine' && !myPostIds.has(p.id) && !myCommentPostIds.has(p.id)) return false
    if (search) {
      const q = search.toLowerCase()
      if (!p.text.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q)) && !p.author.name.toLowerCase().includes(q)) return false
    }
    return true
  })

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '0.5px solid #ddd',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '13px',
    outline: 'none',
    color: '#222',
    background: '#fff',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: '#f5f5f3', minHeight: '100vh' }}>

      <div style={{ background: '#293451', padding: '40px 80px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Stanley Gibbons</div>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '40px', fontWeight: '600', color: '#fff', margin: 0 }}>Community</h1>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>Discuss stamps, share finds, and connect with collectors worldwide</div>
          </div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            {posts.length} discussions · {posts.reduce((s, p) => s + p.comments.length, 0)} comments
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 48px' }}>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search discussions..."
              style={{ ...inputStyle, paddingLeft: '38px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '14px' }}>🔍</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: '#fff', border: '0.5px solid #ddd', borderRadius: '6px', padding: '3px' }}>
            {[{ value: 'all', label: 'All posts' }, { value: 'mine', label: 'My activity' }].map(function(opt) {
              return (
                <button key={opt.value} onClick={() => setFilter(opt.value)} style={{ padding: '7px 16px', borderRadius: '4px', border: 'none', background: filter === opt.value ? '#293451' : 'transparent', color: filter === opt.value ? '#fff' : '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {opt.label}
                </button>
              )
            })}
          </div>
          <button onClick={() => setComposing(true)} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#a3925f', color: '#293451', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + New post
          </button>
        </div>

        {composing && (
          <div style={{ background: '#fff', borderRadius: '10px', border: '0.5px solid #ddd', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <Avatar initials={CURRENT_USER.initials} bg="#a3925f" color="#293451" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451', marginBottom: '8px' }}>{CURRENT_USER.name}</div>
                <textarea value={newPostText} onChange={e => setNewPostText(e.target.value)} placeholder="What's on your mind? Share a find, ask a question, or start a discussion..." rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
                <input type="text" value={newPostTags} onChange={e => setNewPostTags(e.target.value)} placeholder="Tags (comma separated, e.g. Falklands, KGVI, Auction)" style={{ ...inputStyle, marginTop: '8px' }} />

                {/* Image preview */}
                {newPostImage && (
                  <div style={{ position: 'relative', marginTop: '12px', display: 'inline-block' }}>
                    <img src={newPostImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '320px', borderRadius: '6px', border: '0.5px solid #ddd', display: 'block' }} />
                    <button
                      onClick={clearImage}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Image upload button */}
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                  <button
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '5px', border: '0.5px solid #ddd', background: '#fafaf8', color: '#666', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    <span>📷</span> Add photo
                  </button>
                  {newPostImage && (
                    <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888' }}>Photo attached</span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => { setComposing(false); setNewPostText(''); setNewPostTags(''); clearImage() }} style={{ padding: '8px 16px', borderRadius: '5px', border: '0.5px solid #ddd', background: '#fff', color: '#666', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={submitPost} style={{ padding: '8px 20px', borderRadius: '5px', border: 'none', background: '#293451', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Post</button>
            </div>
          </div>
        )}

        {search && (
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888', marginBottom: '16px' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ background: '#fff', borderRadius: '10px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '8px' }}>{filter === 'mine' ? 'No activity yet' : 'No discussions found'}</div>
            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#aaa' }}>{filter === 'mine' ? 'Post or comment on a discussion to see it here.' : 'Try a different search term.'}</div>
          </div>
        )}

        {filtered.map(function(post) {
          const showComments = openComments[post.id]
          const isOwn = post.author.id === CURRENT_USER.id
          return (
            <div key={post.id} style={{ background: '#fff', borderRadius: '10px', border: '0.5px solid #ddd', marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 20px 16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Avatar initials={post.author.initials} bg={isOwn ? '#a3925f' : '#293451'} color={isOwn ? '#293451' : '#fff'} />
                  <div style={{ flex: 1 }}>
                    <div>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{post.author.name}</span>
                      {isOwn && <span style={{ marginLeft: '6px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '3px', background: '#eaecf2', color: '#293451' }}>You</span>}
                      <span style={{ marginLeft: '8px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#aaa' }}>{timeAgo(post.timestamp)}</span>
                    </div>
                    {post.text && <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#333', lineHeight: '1.7', marginTop: '8px' }}>{post.text}</div>}
                    {post.image && (
                      <div style={{ marginTop: '12px' }}>
                        <img src={post.image} alt="Post image" style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '6px', border: '0.5px solid #eee', display: 'block' }} />
                      </div>
                    )}
                    {post.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                        {post.tags.map(function(tag) {
                          return (
                            <span key={tag} onClick={() => setSearch(tag)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', background: '#eef0f6', color: '#293451', cursor: 'pointer', border: '0.5px solid #c8ccd8' }}>
                              {tag}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px 20px 12px', display: 'flex', gap: '20px', alignItems: 'center', borderTop: '0.5px solid #f5f5f5' }}>
                <button onClick={() => toggleLike(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: post.liked ? '#293451' : '#aaa', fontWeight: post.liked ? '600' : '400', padding: '4px 0' }}>
                  <span style={{ fontSize: '14px' }}>{post.liked ? '♥' : '♡'}</span>
                  {post.likes > 0 && post.likes}
                </button>
                <button onClick={() => toggleComments(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: showComments ? '#293451' : '#aaa', fontWeight: showComments ? '600' : '400', padding: '4px 0' }}>
                  <span style={{ fontSize: '14px' }}>💬</span>
                  {post.comments.length > 0 ? post.comments.length + ' comment' + (post.comments.length !== 1 ? 's' : '') : 'Comment'}
                </button>
              </div>

              {showComments && (
                <div style={{ borderTop: '0.5px solid #f0f0f0', background: '#fafaf8' }}>
                  {post.comments.map(function(comment) {
                    const isOwnComment = comment.author.id === CURRENT_USER.id
                    return (
                      <div key={comment.id} style={{ padding: '14px 20px', borderBottom: '0.5px solid #f0f0f0', display: 'flex', gap: '10px' }}>
                        <Avatar initials={comment.author.initials} size={32} bg={isOwnComment ? '#a3925f' : '#eaecf2'} color="#293451" fontSize="11px" />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451' }}>{comment.author.name}</span>
                            {isOwnComment && <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', fontWeight: '600', padding: '1px 5px', borderRadius: '3px', background: '#eaecf2', color: '#293451' }}>You</span>}
                            <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#bbb' }}>{timeAgo(comment.timestamp)}</span>
                          </div>
                          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444', lineHeight: '1.6' }}>{comment.text}</div>
                          <button onClick={() => toggleCommentLike(post.id, comment.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: comment.liked ? '#293451' : '#bbb', marginTop: '6px', padding: 0 }}>
                            <span>{comment.liked ? '♥' : '♡'}</span>
                            {comment.likes > 0 && comment.likes}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ padding: '14px 20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Avatar initials={CURRENT_USER.initials} size={32} bg="#a3925f" color="#293451" fontSize="11px" />
                    <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                      <input type="text" value={commentText[post.id] || ''} onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') submitComment(post.id) }} placeholder="Write a comment..." style={{ ...inputStyle, background: '#fff' }} />
                      <button onClick={() => submitComment(post.id)} style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: '#293451', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Post</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
