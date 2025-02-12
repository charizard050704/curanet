from setuptools import setup, find_packages

setup(
    name='curanet',                          # This will be the name on PyPI
    version='0.1.0',                         # Initial version
    author='Adarsh Priydarshi',
    author_email='your_email@example.com',   # Replace with your actual email
    description='A healthcare management system for centralized patient records and hospital dashboards.',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url='https://github.com/yourusername/curanet',  # Replace with GitHub repo if available
    packages=find_packages(),
    install_requires=[
        # Add dependencies here (e.g., 'flask', 'sqlalchemy')
    ],
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)
