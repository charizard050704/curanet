from setuptools import setup, find_packages

setup(
    name='curanet',
    version='0.1.0',
    author='Adarsh Priydarshi',
    author_email='your_email@example.com',  # Replace with your actual email
    description='A healthcare management system for centralized patient records.',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url='https://github.com/yourusername/curanet',  # Replace with GitHub repo URL
    packages=find_packages(),
    install_requires=[
        'flask',
        'sqlalchemy',
        'pandas',
        'numpy',
        'requests',
        'scikit-learn'
    ],
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',

    # Add this part to make `curanet` work as a CLI command:
    entry_points={
        'console_scripts': [
            'curanet=backend.app:main'
        ]
    },
)
