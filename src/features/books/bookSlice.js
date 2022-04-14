import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../apiService";

const initialState = {
  books: [],
  status: "idle",
  errorMessage: "",
  loading: false,
  book: {},
};

export const getBooks = createAsyncThunk(
  "books/getBooks",
  async ({ pageNum, limit, query }, thunkApi) => {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const res = await api.get(url);
    return res.data;
  }
);

export const getSingleBook = createAsyncThunk(
  "books/getSingleBook",
  async ({ bookId }) => {
    const res = await api.get(`/books/${bookId}`);
    return res.data;
  }
);

export const addFavorite = createAsyncThunk(
  "books/addFavorite",
  async ({ addingBook }) => {
    await api.post(`/favorites`, addingBook);
    toast.success("The book has been added to the reading list!");
  }
);

export const getFavorites = createAsyncThunk("books/getFavorites", async () => {
  const res = await api.get(`/favorites`);
  console.log(`getFavorite`);
  console.log(res.data);
  return res.data;
});

export const removeBook = createAsyncThunk(
  "books/removeBook",
  async (removedBookId, { dispatch }) => {
    console.log(`remove book`);
    await api.delete(`/favorites/${removedBookId}`);
    toast.success("The book has been removed");
    dispatch(getFavorites());
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state, action) => {
        //action = {type:"books/getBooks/pending, payload: [{tile:..}]}
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        //action = {type:"books/getBooks/fulfilled", payload: [{tile:..}]}
        state.status = "idle";
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        //action = {type:"books/getBooks/rejected", payload: {error:{message:"fail"}}}
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    builder
      .addCase(getSingleBook.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getSingleBook.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(getSingleBook.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    builder
      .addCase(addFavorite.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    builder
      .addCase(getFavorites.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
    builder
      .addCase(removeBook.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.status = "fail";
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export default bookSlice.reducer;
