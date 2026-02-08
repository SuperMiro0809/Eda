#!/usr/bin/env python3
"""
Document ingestion script for RAG.

Usage:
    python scripts/ingest.py                    # Ingest all documents
    python scripts/ingest.py --reset            # Reset and re-ingest
    python scripts/ingest.py --stats            # Show collection stats
    python scripts/ingest.py --list             # List indexed documents
"""

import sys
import argparse
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.rag.loader import DocumentLoader
from app.rag.chunker import TextChunker
from app.rag.vectorstore import VectorStore

# ----------------------------------------------------------------------


def ingest_documents(reset: bool = False) -> None:
    """Load, chunk, and index all documents."""
    print("=" * 60)
    print("Document Ingestion Pipeline")
    print("=" * 60)

    # Initialize components
    loader = DocumentLoader()
    chunker = TextChunker()
    vectorstore = VectorStore()

    # Reset collection if requested
    if reset:
        print("\nResetting collection...")
        try:
            vectorstore.delete_collection()
            vectorstore = VectorStore()  # Recreate
        except Exception as e:
            print(f"Note: {e}")

    # Load documents
    print("\n[1/3] Loading documents...")
    documents = loader.load_directory()

    if not documents:
        print("\nNo documents found. Add documents to:")
        print(f"  {loader.documents_dir}")
        return

    # Chunk documents
    print("\n[2/3] Chunking documents...")
    chunks = chunker.split_documents(documents)

    # Index chunks
    print("\n[3/3] Indexing chunks...")
    vectorstore.add_documents(chunks)

    # Show stats
    print("\n" + "=" * 60)
    print("Ingestion Complete!")
    print("=" * 60)
    stats = vectorstore.get_stats()
    print(f"Collection: {stats['collection_name']}")
    print(f"Total chunks indexed: {stats['document_count']}")


def show_stats() -> None:
    """Show collection statistics."""
    vectorstore = VectorStore()
    stats = vectorstore.get_stats()

    print("Collection Statistics")
    print("-" * 40)
    print(f"Name: {stats['collection_name']}")
    print(f"Documents: {stats['document_count']}")
    print(f"Persist Dir: {stats['persist_dir']}")


def list_documents() -> None:
    """List all indexed documents."""
    vectorstore = VectorStore()
    sources = vectorstore.list_documents()

    print("Indexed Documents")
    print("-" * 40)
    if sources:
        for source in sources:
            print(f"  - {source}")
    else:
        print("  No documents indexed")


def main():
    parser = argparse.ArgumentParser(description="Document ingestion for RAG")
    parser.add_argument("--reset", action="store_true", help="Reset collection before ingesting")
    parser.add_argument("--stats", action="store_true", help="Show collection statistics")
    parser.add_argument("--list", action="store_true", help="List indexed documents")

    args = parser.parse_args()

    if args.stats:
        show_stats()
    elif args.list:
        list_documents()
    else:
        ingest_documents(reset=args.reset)


if __name__ == "__main__":
    main()
