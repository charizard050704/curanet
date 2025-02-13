import os

# Define the directory and file path
docs_folder = 'docs'
progress_file = os.path.join(docs_folder, 'progress.tex')

# Check if the docs folder exists, if not, create it
if not os.path.exists(docs_folder):
    os.makedirs(docs_folder)
    print(f"Folder '{docs_folder}' created successfully.")

# Check if the progress.tex file exists, if not, create and write initial content
if not os.path.isfile(progress_file):
    with open(progress_file, 'w') as f:
        f.write(r"""
\documentclass{article}
\usepackage{geometry}
\geometry{a4paper, margin=1in}
\usepackage{datetime}

\title{CuraNet Project Progress}
\author{Adarsh Priydarshi}
\date{\today}

\begin{document}

\maketitle

\section*{Initial Setup}
\begin{itemize}
    \item Project \textbf{CuraNet} initialized for healthcare management.
    \item Directory structure created: \texttt{backend}, \texttt{frontend}, \texttt{database}, \texttt{docs}.
    \item GitHub repository initialized, \texttt{main} branch set as primary.
\end{itemize}

\section*{Backend Packaging}
\begin{itemize}
    \item Backend folder structured with \texttt{app.py} and \texttt{\_\_init\_\_.py}.
    \item Packaged project with \texttt{setup.py}, making \texttt{curanet} executable via CLI.
    \item Confirmed functionality with CLI output: \texttt{CuraNet is running!}.
\end{itemize}

\section*{Next Steps}
\begin{itemize}
    \item Design database schema and ER diagrams.
    \item Implement and integrate database with backend.
    \item Continue documenting progress after each milestone.
\end{itemize}

\end{document}
        """)
    print(f"File '{progress_file}' created and initialized successfully.")
else:
    print(f"File '{progress_file}' already exists.")
