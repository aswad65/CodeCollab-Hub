import React, { useEffect, useState, useRef } from 'react'
import { useProjectContext } from '../Context/ProjectContext'
import { useUserContext } from '../Context/UserContext'
import axios from 'axios'
import { useLocation, useSearch } from '@tanstack/react-router'

import { toast } from 'react-hot-toast'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx';
import Editor from 'react-simple-code-editor';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { initializeWebContainer } from '../config/webcontainer';

export const Project = () => {
  const [showUserList, setShowUserList] = useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const clickref = useRef()
  const { getAll, users, user } = useUserContext()
  const { fetchProjectCollaborators, Getproject, fetchProjects } = useProjectContext()
  const [open, setopen] = useState(false)
  const [collaborators, setCollaborators] = useState([])
  const location = useLocation()
  const search = useSearch({ strict: false })
  const [message, setmessage] = useState("")
  const longQuote = "True progress rarely arrives in a single moment; it is the sum of tiny decisions, patient practice, and the courage to restart when things go wrong. When you stitch together those small acts, what looks impossible becomes inevitable. ".repeat(6)
  const [messages, setmessages] = useState([{ message: longQuote, sender: { email: "AI" } }])
  const [filesArray, setfilesArray] = useState([])
  const [IframeUrl, setIframeUrl] = useState(null)
  const [files, setfiles] = useState({})
  const [webcontainer, setwebcontainer] = useState(null)
  const [currentfile, setcurrentfile] = useState(null)
  const [name, setName] = React.useState('')
  const [expandedMessages, setExpandedMessages] = useState({})
  const messageRef = useRef()
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const mountedRef = useRef(false);

  const [showPreview, setShowPreview] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(IframeUrl || "");
  const [iframeKey, setIframeKey] = React.useState(0); 
  const url ="http://localhost:5000"
  React.useEffect(() => {
    if (IframeUrl && !previewUrl) setPreviewUrl(IframeUrl);
  }, [IframeUrl]);

  React.useEffect(() => {
    if (IframeUrl && previewUrl !== IframeUrl && previewUrl === "") {
      setPreviewUrl(IframeUrl);
    }
  }, [IframeUrl, previewUrl]);

  const handleCopyUrl = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      toast.success("URL copied!");
    }
  };

  const handleReloadIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleHidePreview = () => {
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const toggleExpand = (idx) => {
    setExpandedMessages(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const handleCreateFile = () => {
    if (newFileName.trim() === '') {
      toast.error('File name cannot be empty.');
      return;
    }
    if (files[newFileName]) {
      toast.error('File with this name already exists.');
      return;
    }
    setfiles(prev => ({
      ...prev,
      [newFileName]: { content: '' }
    }));
    setNewFileName('');
    setShowNewFileModal(false);
    toast.success(`${newFileName} created successfully.`);
  };

  useEffect(() => {
    axios.get(`${url}/api/project/getAll-project`, { withCredentials: true })
  }, [])

  const projectId = location.state?.project?._id || search?.projectId || null

  useEffect(() => {
    if (projectId) {
      fetchProjectCollaborators(projectId)
        .then((data) => setCollaborators(data))
    }
  }, [projectId])

  useEffect(() => {
    fetchProjects()
    setfiles(Getproject.find(project => project._id === projectId)?.fileTree || {});
  }, [fetchProjects])

  useEffect(() => {
    if (showUserList && Array.isArray(users) && users.length === 0) {
      getAll()

    }
    if (filesArray.length === 0) {
      setcurrentfile(null);
      return;
    }
  }, [showUserList, users, getAll, filesArray])

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const Watchcollaborator = () => {
    setopen(true)
  }
  const cancelhandler = () => {
    setopen(false)
  }
  const handleAddCollaborators = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user')
      return
    }
    try {
      const response = await axios.put(
        `${url}/api/project/add-user`,
        { user: selectedUsers, projectId: projectId },
        { withCredentials: true }
      )
      toast.success(response.data?.message || 'Collaborators added')
      setShowUserList(false)
      setSelectedUsers([])
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Failed to add collaborators'
      toast.error(msg)
    }
  }
  useEffect(() => {
    initializeSocket(projectId)
    receiveMessage(async (data) => {
      setmessages(prev => [...prev, data]);
    })
  }, [projectId])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender?.email === "AI" && typeof lastMessage.message === 'object') {
      const fileTree = lastMessage.message?.fileTree;
      if (fileTree && typeof fileTree === 'object') {
        const normalizedFiles = {};
        Object.entries(fileTree).forEach(([filename, fileData]) => {
          if (fileData?.file?.contents !== undefined) {
            normalizedFiles[filename] = { content: fileData.file.contents };
          }
          else if (fileData?.content !== undefined) {
            normalizedFiles[filename] = fileData;
          }
          else if (typeof fileData === 'string') {
            normalizedFiles[filename] = { content: fileData };
          }
          else {
          }
        });
        if (Object.keys(normalizedFiles).length > 0) {
          setfiles(prev => ({ ...prev, ...normalizedFiles }));
          Updatefiletree({ ...files, ...normalizedFiles });
        }
      }
    }
  }, [messages])

  useEffect(() => {
    const startContainer = async () => {
      if (!webcontainer) {
        const instance = await initializeWebContainer();
        setwebcontainer(instance);
      }
    };
    startContainer();
  }, []);

  function send() {
    if (!message.trim()) return;
    sendMessage("project-message", {
      message: message,
      sender: user,
    })
    setmessages(prev => [...prev, { message: message, sender: user }])
    setmessage("")
  }

  function interfaceOffile(file) {
    setcurrentfile(file)
    if (!filesArray.includes(file)) {
      setfilesArray([...filesArray, file]);
    }
  }
  const closeFile = (filename) => {
    const updated = filesArray.filter(f => f !== filename);
    setfilesArray(updated);
  };

  const getLanguageFromFileName = (fileName) => {
    if (!fileName) return 'plaintext';
    const extension = fileName.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'xml': 'xml',
      'md': 'markdown',
      'sh': 'bash',
      'sql': 'sql',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
    };
    return languageMap[extension] || 'plaintext';
  };

  const highlightCode = (code) => {
    if (!currentfile || !code || typeof code !== 'string') return code || '';
    const language = getLanguageFromFileName(currentfile);
    try {
      if (language === 'plaintext') {
        const escaped = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>")
          .replace(/\s/g, "&nbsp;");
        return `<pre class="hljs-plaintext">${escaped}</pre>`;
      }
      return hljs.highlight(code, { language }).value;
    } catch (err) {
      try {
        return hljs.highlightAuto(code).value;
      } catch {
        return code;
      }
    }
  };

  const handleCreate = () => {
    setName('');
    setIsOpen(false);
    setfiles(prev => {
      const updatedFiles = { ...prev, [name]: { content: '' } };
      Updatefiletree(updatedFiles);
      return updatedFiles;
    });
    setfilesArray(prev => [...prev, name]);
    setcurrentfile(name);
    toast.success('File created successfully');
  }
  const Updatefiletree = async (fileTree) => {
    try {
      await axios.put(
        `${url}/api/project/get-project-filetree`,
        { projectId, fileTree },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error updating file tree:", error);
    }
  }

  function WriteAicode(message) {
    if (!message) return '';
    try {
      let response = message;
      if (typeof message === 'string') {
        try {
          response = JSON.parse(message);
        } catch (err) {
          return message;
        }
      }
      return response?.text ?? (typeof response === 'string' ? response : JSON.stringify(response));
    } catch (err) {
      console.error('WriteAicode parse error', err);
      return '';
    }
  }

  const convertToWebContainerFormat = (files) => {
    const formatted = {};
    Object.entries(files).forEach(([name, data]) => {
      formatted[name] = {
        file: {
          contents: data.content
        }
      };
    });
    return formatted;
  };

  let serverProcess;

const handleRun = async () => {
  if (!files || Object.keys(files).length === 0) {
    toast.error("No files available to run");
    return;
  }

  let instance = webcontainer;
  if (!instance) {
    instance = await initializeWebContainer();
    setwebcontainer(instance);
  }

  if (serverProcess) {
    await serverProcess.kill();
    console.log("Previous server killed");
  }

  const formattedFiles = convertToWebContainerFormat(files);
  await instance.mount(formattedFiles);

  const installProcess = await instance.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(chunk) {
      console.log(chunk);
    }
  }));

  serverProcess = await instance.spawn('npm', ['start']);
  serverProcess.output.pipeTo(new WritableStream({
    write(chunk) {
      console.log(chunk);
    }
  }));

  instance.on('server-ready', (port, url) => {
    setIframeUrl(url);
  });

  toast.success('Running code');
};

  return (
    <>
      <main className="flex w-full h-screen overflow-hidden">
        <div className="w-[400px] min-w-[300px] max-w-[400px] h-full flex flex-col bg-white shadow-2xl shadow-gray-500 shrink-0">
          {/* HEADER */}
          <header className="w-full h-10 bg-[oklch(0.24_0.02_267.88)] flex justify-between items-center px-4 shrink-0">
            <h3 className="text-white flex items-center gap-2">
              <span
                onClick={() => setShowUserList(true)}
                className="text-[30px] cursor-pointer"
              >
                +
              </span>
              Add collaborators
            </h3>
            <svg
              ref={clickref}
              onClick={Watchcollaborator}
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="#EFEFEF"
              viewBox="0 -960 960 960"
            >
              <path d="M185-80q-17 0-29.5-12.5T143-122v-105q0-90 56-159t144-88q-40 28-62 70.5T259-312v190q0 11 3 22t10 20h-87Zm147 0q-17 0-29.5-12.5T290-122v-190q0-70 49.5-119T459-480h189q70 0 119 49t49 119v64q0 70-49 119T648-80H332Zm148-484q-66 0-112-46t-46-112q0-66 46-112t112-46q66 0 112 46t46 112q0 66-46 112t-112 46Z" />
            </svg>
          </header>
          {/* CHAT AREA */}
          <section
            style={{ backgroundImage: "url('ff.avif')" }}
            className="flex-1 overflow-y-auto"
          >
            <div ref={messageRef} className="flex flex-col gap-1 p-2" />
            {messages?.map((msg, index) => {
              const isAI = msg?.sender?.email === "AI";
              const isMe = msg?.sender?.email === user?.email;
              const containerAlign = isMe ? "items-end" : "items-start";
              const bubbleClass = isAI
                ? "ml-2 mb-2 rounded-lg bg-black text-white text-[15px] font-semibold max-w-[85%] overflow-x-auto w-fit break-words p-2"
                : "mr-2 mb-2 rounded-lg bg-white text-black text-[15px] font-semibold max-w-[85%] overflow-hidden w-fit break-words p-2 border border-gray-200";
              return (
                <div
                  key={index}
                  className={`w-full flex flex-col ${containerAlign} mb-4`}
                >
                  <div className="text-xs text-gray-500 px-2 mb-1">
                    {isMe ? "You" : isAI ? "AI" : msg.sender?.email}
                  </div>
                  <div className={bubbleClass}>
                    {(() => {
                      const expanded = !!expandedMessages[index];
                      const isLong =
                        typeof msg.message === "string" &&
                        msg.message.length > 320;
                      return (
                        <>
                          <div
                            className={
                              expanded
                                ? ""
                                : "max-h-[140px] overflow-hidden relative"
                            }
                          >
                            <Markdown
                              className="text-[15px] font-medium break-words"
                              components={{
                                code({ inline, children }) {
                                  return inline ? (
                                    <code className="bg-gray-800 text-pink-400 px-1 rounded text-sm">
                                      {children}
                                    </code>
                                  ) : (
                                    <div className="w-full  my-2">
                                      <pre className="rounded-xl bg-[#1a1a1a] text-[#d1d5db] text-[13.5px] font-mono leading-6 p-4 border border-[#333]">
                                        <code>{children}</code>
                                      </pre>
                                    </div>
                                  );
                                },
                              }}
                            >
                              {isAI ? WriteAicode(msg.message) : msg.message}
                            </Markdown>
                            {isLong && !expanded && (
                              <div
                                className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${isAI
                                  ? "from-black/70 to-transparent"
                                  : "from-white/80 to-transparent"
                                  }`}
                              />
                            )}
                          </div>
                          {isLong && (
                            <div className="text-right mt-1">
                              <button
                                onClick={() => toggleExpand(index)}
                                className={`text-sm ${isAI
                                  ? "text-blue-300"
                                  : "text-blue-600"
                                  } hover:underline`}
                              >
                                {expanded ? "Show less" : "Show more"}
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </section>
          {/* INPUT BAR */}
          <footer className="border-t shrink-0">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    send()
                  }
                }}
                className="w-full px-2 h-10 outline-none"
              />
              <button
                onClick={send}
                disabled={!message.trim()}
                className={`p-2 transition ${message.trim()
                  ? "bg-[oklch(0.24_0.02_267.88)] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="24"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </footer>
        </div>
        <aside className="min-w-[120px] max-w-[180px] h-full flex flex-col gap-[1px] bg-gray-300 shrink-0 overflow-y-auto">
          {/* File tree toolbar */}
          <div className="flex justify-around items-center h-10 bg-gray-200 p-2">
            <h3 className='text-gray-700 font-bold'>{Getproject?.find(project => project._id === projectId)?.name || "Project Name"}</h3>
            <svg onClick={() => setIsOpen(true)} className="w-5 h-5 cursor-pointer text-gray-700 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 14h-2v-3H8v-2h3V8h2v3h3v2h-3v3zM6 20V4h7v4h4v12H6z" /></svg>
          </div>
          {Object.keys(files)?.map((file, index) => (
            <button
              key={index}
              onClick={() => interfaceOffile(file)}
              className="bg-gray-400 px-2 flex  items-center h-10 w-full hover:bg-gray-500 transition-colors"
            >
              <p
                className="truncate gap-1 flex text-ellipsis whitespace-nowrap w-full text-left"
                title={file}
              >
                {file}
              </p>
         </button>
          ))}
          {isOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/30  bg-opacity-40"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false);
              }}
            >
              <div
                className="bg-white rounded-lg shadow-lg w-[200px] max-w-md p-6 mx-4"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">New File</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
                  placeholder="Project name"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 rounded cursor-pointer bg-blue-600 flex justify-center items-center w-full text-white"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
        <div className={`flex h-full min-w-0 transition-all duration-300 ${showPreview ? "" : "w-full"}`}>
          {/* Code Editor Section */}
          <div className={`flex-1 h-full min-w-0 overflow-hidden transition-all duration-300 ${showPreview ? "border-r border-gray-700" : "w-full"}`}>

            {currentfile && files[currentfile] ? (
              <div className={`h-full flex flex-col top-0 w-full`}>
                <div className="top flex gap-[1px] items-center justify-between ">
                  <div className="flex gap-[1px] min-w-10 ">
                    {filesArray?.map((file, index) => (
                      <button key={index} onClick={() => setcurrentfile(file)} className={`cursor-pointer items-center h-10 justify-center gap-2 bg-gray-300 flex w-fit p-4 shrink-0 ${currentfile === file ? "bg-gray-500" : ""}`}>
                        <h3 className='font-medium'>{file}</h3>
                        <svg onClick={() => closeFile(file)} className='w-4' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                      </button>
                    ))}
                  </div>
                  <div className='flex gap-1 '>
                    <button onClick={handleRun} className='h-10  cursor-pointer px-4 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shrink-0'>
                      Run
                    </button>
                    {!showPreview && (
                      <div className="flex   ">
                        <button
                          onClick={handleShowPreview}
                          className="bg-gray-800 cursor-pointer  text-white px-4 py-2 rounded shadow  hover:bg-gray-700 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EFEFEF"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm240-80h400v-480H400v480Zm-80 0v-480H160v480h160Zm-160 0v-480 480Zm160 0h80-80Zm0-480h80-80Z" /></svg>
                        </button>
                      </div>
                    )}

                  </div>

                </div>
                <div className="bottom w-full flex-1 overflow-auto bg-[#1e1e1e]">
                  <Editor
                    value={files[currentfile]?.content || ''}
                    onValueChange={(code) => {
                      const updatedFiles = {
                        ...files,
                        [currentfile]: { content: code }
                      };
                      setfiles(updatedFiles);
                      Updatefiletree(updatedFiles);
                    }}
                    highlight={highlightCode}
                    padding={16}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 14,
                      backgroundColor: '#1e1e1e',
                      color: '#d4d4d4',
                      width: '100%',
                      maxWidth: '100%',
                      minHeight: '100%',
                      outline: 'none',
                      whiteSpace: 'pre',
                      overflowX: 'auto',
                      overflowY: 'auto',
                    }}
                    textareaClassName="editor-textarea"
                    preClassName="editor-pre"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
                <p>Select a file to edit</p>
              </div>
            )}
          </div>
          {/* Preview Panel Section */}
          {showPreview && (
            <div className="w-[50%] right-0 min-w-[320px] max-w-[900px] h-full flex flex-col bg-gray-100 border-l border-gray-700 transition-all duration-300 relative shadow-lg rounded-l-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-900 text-white rounded-tl-xl border-b border-gray-800">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 text-white px-3 py-1 rounded focus:outline-none focus:ring focus:ring-blue-500 text-xs mr-2"
                  value={previewUrl}
                  onChange={e => setPreviewUrl(e.target.value)}
                  placeholder="Enter preview URL..."
                  spellCheck={false}
                />
                <button
                  onClick={handleCopyUrl}
                  className="ml-1 px-2 py-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-600 text-xs"
                  title="Copy URL"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12H6.75A2.25 2.25 0 014.5 9.75v-6A2.25 2.25 0 016.75 1.5h6A2.25 2.25 0 0115 3.75V6" />
                    <rect width="13.5" height="13.5" x="6.75" y="6.75" rx="2.25" />
                  </svg>
                </button>
                <button
                  onClick={handleReloadIframe}
                  className="ml-1 px-2 py-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-600 text-xs"
                  title="Reload Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0m-7.5 4.5V12h4.5" />
                  </svg>
                </button>
                <button
                  onClick={handleHidePreview}
                  className="ml-1 px-2 py-1 rounded bg-red-700 cursor-pointer hover:bg-red-600 text-xs"
                  title="Hide Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 bg-black/90 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <iframe
                    key={iframeKey}
                    src={previewUrl}
                    className="w-full h-full border-0 rounded-bl-xl transition-all duration-300 bg-white"
                    title="Live Preview"
                    allow="accelerometer; camera; encrypted-media; geolocation; microphone; clipboard-write;"
                  />
                ) : (
                  <div className="text-gray-400 text-center w-full">No preview URL</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <div>
        {showUserList && (
          <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white text-shadow-2xs  shadow-gray-500 rounded-lg p-6 w-96 max-h-96 overflow-y-auto shadow-lg'>
              <h2 className='text-lg font-bold mb-4'>Select Collaborators</h2>
              <div className=' flex flex-col gap-2 w-full h-[230px] overflow-y-scroll  '>
                {users && users.length > 0 ? (
                  users?.map((user) => (
                    <label
                      key={user._id} className='flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50'>
                      <input
                        type='checkbox'
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                        className='mr-3 w-4 h-4 cursor-pointer'
                      />
                      <span className='text-gray-800'>{user.email}</span>
                    </label>
                  ))
                ) : (
                  <p className='text-gray-500'>No users available</p>
                )}
              </div>
              <div className='flex gap-2 mt-4'>
                <button
                  onClick={() => {
                    setShowUserList(false)
                    setSelectedUsers([])
                  }}
                  className='flex-1 cursor-pointer bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400'>
                  Cancel
                </button>
                <button
                  onClick={handleAddCollaborators}
                  disabled={selectedUsers.length === 0}
                  className='flex-1 bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600 disabled:bg-gray-400'>
                  Add ({selectedUsers.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={`transition-all duration-300 w-[400px] h-full shadow-2xl shadow-gray-500 bg-gray-50 absolute top-0 left-0 ${open ? 'ml-0' : '-ml-[400px]'}`}>
        <div className='flex justify-center items-center flex-col gap-2'>
          <div className='flex '><h2 className='text-lg ml-[125px] font-bold mb-4'>Collaborators</h2>
            <svg onClick={cancelhandler} className='ml-[120px] cursor-pointer' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
          </div>
          <div className='flex flex-col gap-2'>
            {collaborators?.map((user) => (
              <div key={user._id}>
                <span className='border-2 p-3 rounded-md flex gap-2 flex-col font-semibold w-full '>@{user.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Create New File</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded"
              placeholder="Enter file name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFile();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}