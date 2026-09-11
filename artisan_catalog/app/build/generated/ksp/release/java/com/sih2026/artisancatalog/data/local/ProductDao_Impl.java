package com.sih2026.artisancatalog.data.local;

import android.database.Cursor;
import android.os.CancellationSignal;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.room.CoroutinesRoom;
import androidx.room.EntityDeletionOrUpdateAdapter;
import androidx.room.EntityInsertionAdapter;
import androidx.room.RoomDatabase;
import androidx.room.RoomSQLiteQuery;
import androidx.room.SharedSQLiteStatement;
import androidx.room.util.CursorUtil;
import androidx.room.util.DBUtil;
import androidx.sqlite.db.SupportSQLiteStatement;
import java.lang.Class;
import java.lang.Exception;
import java.lang.Integer;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import javax.annotation.processing.Generated;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlinx.coroutines.flow.Flow;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class ProductDao_Impl implements ProductDao {
  private final RoomDatabase __db;

  private final EntityInsertionAdapter<ProductEntity> __insertionAdapterOfProductEntity;

  private final Converters __converters = new Converters();

  private final EntityDeletionOrUpdateAdapter<ProductEntity> __deletionAdapterOfProductEntity;

  private final EntityDeletionOrUpdateAdapter<ProductEntity> __updateAdapterOfProductEntity;

  private final SharedSQLiteStatement __preparedStmtOfDeleteProductById;

  public ProductDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertionAdapterOfProductEntity = new EntityInsertionAdapter<ProductEntity>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `products` (`id`,`title`,`description`,`craftHistory`,`imageUris`,`voiceTranscription`,`materialCost`,`laborCost`,`margin`,`suggestedPrice`,`category`,`language`,`createdAt`,`syncStatus`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final ProductEntity entity) {
        statement.bindString(1, entity.getId());
        statement.bindString(2, entity.getTitle());
        statement.bindString(3, entity.getDescription());
        statement.bindString(4, entity.getCraftHistory());
        final String _tmp = __converters.fromStringList(entity.getImageUris());
        statement.bindString(5, _tmp);
        statement.bindString(6, entity.getVoiceTranscription());
        statement.bindDouble(7, entity.getMaterialCost());
        statement.bindDouble(8, entity.getLaborCost());
        statement.bindDouble(9, entity.getMargin());
        statement.bindDouble(10, entity.getSuggestedPrice());
        statement.bindString(11, entity.getCategory());
        statement.bindString(12, entity.getLanguage());
        statement.bindLong(13, entity.getCreatedAt());
        statement.bindString(14, entity.getSyncStatus());
      }
    };
    this.__deletionAdapterOfProductEntity = new EntityDeletionOrUpdateAdapter<ProductEntity>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "DELETE FROM `products` WHERE `id` = ?";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final ProductEntity entity) {
        statement.bindString(1, entity.getId());
      }
    };
    this.__updateAdapterOfProductEntity = new EntityDeletionOrUpdateAdapter<ProductEntity>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "UPDATE OR ABORT `products` SET `id` = ?,`title` = ?,`description` = ?,`craftHistory` = ?,`imageUris` = ?,`voiceTranscription` = ?,`materialCost` = ?,`laborCost` = ?,`margin` = ?,`suggestedPrice` = ?,`category` = ?,`language` = ?,`createdAt` = ?,`syncStatus` = ? WHERE `id` = ?";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final ProductEntity entity) {
        statement.bindString(1, entity.getId());
        statement.bindString(2, entity.getTitle());
        statement.bindString(3, entity.getDescription());
        statement.bindString(4, entity.getCraftHistory());
        final String _tmp = __converters.fromStringList(entity.getImageUris());
        statement.bindString(5, _tmp);
        statement.bindString(6, entity.getVoiceTranscription());
        statement.bindDouble(7, entity.getMaterialCost());
        statement.bindDouble(8, entity.getLaborCost());
        statement.bindDouble(9, entity.getMargin());
        statement.bindDouble(10, entity.getSuggestedPrice());
        statement.bindString(11, entity.getCategory());
        statement.bindString(12, entity.getLanguage());
        statement.bindLong(13, entity.getCreatedAt());
        statement.bindString(14, entity.getSyncStatus());
        statement.bindString(15, entity.getId());
      }
    };
    this.__preparedStmtOfDeleteProductById = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM products WHERE id = ?";
        return _query;
      }
    };
  }

  @Override
  public Object insertProduct(final ProductEntity product,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfProductEntity.insert(product);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object insertProducts(final List<ProductEntity> products,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfProductEntity.insert(products);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object deleteProduct(final ProductEntity product,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __deletionAdapterOfProductEntity.handle(product);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object updateProduct(final ProductEntity product,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __updateAdapterOfProductEntity.handle(product);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object deleteProductById(final String id, final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfDeleteProductById.acquire();
        int _argIndex = 1;
        _stmt.bindString(_argIndex, id);
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfDeleteProductById.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Flow<List<ProductEntity>> getAllProducts() {
    final String _sql = "SELECT * FROM products ORDER BY createdAt DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"products"}, new Callable<List<ProductEntity>>() {
      @Override
      @NonNull
      public List<ProductEntity> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfDescription = CursorUtil.getColumnIndexOrThrow(_cursor, "description");
          final int _cursorIndexOfCraftHistory = CursorUtil.getColumnIndexOrThrow(_cursor, "craftHistory");
          final int _cursorIndexOfImageUris = CursorUtil.getColumnIndexOrThrow(_cursor, "imageUris");
          final int _cursorIndexOfVoiceTranscription = CursorUtil.getColumnIndexOrThrow(_cursor, "voiceTranscription");
          final int _cursorIndexOfMaterialCost = CursorUtil.getColumnIndexOrThrow(_cursor, "materialCost");
          final int _cursorIndexOfLaborCost = CursorUtil.getColumnIndexOrThrow(_cursor, "laborCost");
          final int _cursorIndexOfMargin = CursorUtil.getColumnIndexOrThrow(_cursor, "margin");
          final int _cursorIndexOfSuggestedPrice = CursorUtil.getColumnIndexOrThrow(_cursor, "suggestedPrice");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfLanguage = CursorUtil.getColumnIndexOrThrow(_cursor, "language");
          final int _cursorIndexOfCreatedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "createdAt");
          final int _cursorIndexOfSyncStatus = CursorUtil.getColumnIndexOrThrow(_cursor, "syncStatus");
          final List<ProductEntity> _result = new ArrayList<ProductEntity>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final ProductEntity _item;
            final String _tmpId;
            _tmpId = _cursor.getString(_cursorIndexOfId);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpDescription;
            _tmpDescription = _cursor.getString(_cursorIndexOfDescription);
            final String _tmpCraftHistory;
            _tmpCraftHistory = _cursor.getString(_cursorIndexOfCraftHistory);
            final List<String> _tmpImageUris;
            final String _tmp;
            _tmp = _cursor.getString(_cursorIndexOfImageUris);
            _tmpImageUris = __converters.toStringList(_tmp);
            final String _tmpVoiceTranscription;
            _tmpVoiceTranscription = _cursor.getString(_cursorIndexOfVoiceTranscription);
            final double _tmpMaterialCost;
            _tmpMaterialCost = _cursor.getDouble(_cursorIndexOfMaterialCost);
            final double _tmpLaborCost;
            _tmpLaborCost = _cursor.getDouble(_cursorIndexOfLaborCost);
            final double _tmpMargin;
            _tmpMargin = _cursor.getDouble(_cursorIndexOfMargin);
            final double _tmpSuggestedPrice;
            _tmpSuggestedPrice = _cursor.getDouble(_cursorIndexOfSuggestedPrice);
            final String _tmpCategory;
            _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            final String _tmpLanguage;
            _tmpLanguage = _cursor.getString(_cursorIndexOfLanguage);
            final long _tmpCreatedAt;
            _tmpCreatedAt = _cursor.getLong(_cursorIndexOfCreatedAt);
            final String _tmpSyncStatus;
            _tmpSyncStatus = _cursor.getString(_cursorIndexOfSyncStatus);
            _item = new ProductEntity(_tmpId,_tmpTitle,_tmpDescription,_tmpCraftHistory,_tmpImageUris,_tmpVoiceTranscription,_tmpMaterialCost,_tmpLaborCost,_tmpMargin,_tmpSuggestedPrice,_tmpCategory,_tmpLanguage,_tmpCreatedAt,_tmpSyncStatus);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @Override
  public Object getProductById(final String id,
      final Continuation<? super ProductEntity> $completion) {
    final String _sql = "SELECT * FROM products WHERE id = ? LIMIT 1";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, id);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<ProductEntity>() {
      @Override
      @Nullable
      public ProductEntity call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfDescription = CursorUtil.getColumnIndexOrThrow(_cursor, "description");
          final int _cursorIndexOfCraftHistory = CursorUtil.getColumnIndexOrThrow(_cursor, "craftHistory");
          final int _cursorIndexOfImageUris = CursorUtil.getColumnIndexOrThrow(_cursor, "imageUris");
          final int _cursorIndexOfVoiceTranscription = CursorUtil.getColumnIndexOrThrow(_cursor, "voiceTranscription");
          final int _cursorIndexOfMaterialCost = CursorUtil.getColumnIndexOrThrow(_cursor, "materialCost");
          final int _cursorIndexOfLaborCost = CursorUtil.getColumnIndexOrThrow(_cursor, "laborCost");
          final int _cursorIndexOfMargin = CursorUtil.getColumnIndexOrThrow(_cursor, "margin");
          final int _cursorIndexOfSuggestedPrice = CursorUtil.getColumnIndexOrThrow(_cursor, "suggestedPrice");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfLanguage = CursorUtil.getColumnIndexOrThrow(_cursor, "language");
          final int _cursorIndexOfCreatedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "createdAt");
          final int _cursorIndexOfSyncStatus = CursorUtil.getColumnIndexOrThrow(_cursor, "syncStatus");
          final ProductEntity _result;
          if (_cursor.moveToFirst()) {
            final String _tmpId;
            _tmpId = _cursor.getString(_cursorIndexOfId);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpDescription;
            _tmpDescription = _cursor.getString(_cursorIndexOfDescription);
            final String _tmpCraftHistory;
            _tmpCraftHistory = _cursor.getString(_cursorIndexOfCraftHistory);
            final List<String> _tmpImageUris;
            final String _tmp;
            _tmp = _cursor.getString(_cursorIndexOfImageUris);
            _tmpImageUris = __converters.toStringList(_tmp);
            final String _tmpVoiceTranscription;
            _tmpVoiceTranscription = _cursor.getString(_cursorIndexOfVoiceTranscription);
            final double _tmpMaterialCost;
            _tmpMaterialCost = _cursor.getDouble(_cursorIndexOfMaterialCost);
            final double _tmpLaborCost;
            _tmpLaborCost = _cursor.getDouble(_cursorIndexOfLaborCost);
            final double _tmpMargin;
            _tmpMargin = _cursor.getDouble(_cursorIndexOfMargin);
            final double _tmpSuggestedPrice;
            _tmpSuggestedPrice = _cursor.getDouble(_cursorIndexOfSuggestedPrice);
            final String _tmpCategory;
            _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            final String _tmpLanguage;
            _tmpLanguage = _cursor.getString(_cursorIndexOfLanguage);
            final long _tmpCreatedAt;
            _tmpCreatedAt = _cursor.getLong(_cursorIndexOfCreatedAt);
            final String _tmpSyncStatus;
            _tmpSyncStatus = _cursor.getString(_cursorIndexOfSyncStatus);
            _result = new ProductEntity(_tmpId,_tmpTitle,_tmpDescription,_tmpCraftHistory,_tmpImageUris,_tmpVoiceTranscription,_tmpMaterialCost,_tmpLaborCost,_tmpMargin,_tmpSuggestedPrice,_tmpCategory,_tmpLanguage,_tmpCreatedAt,_tmpSyncStatus);
          } else {
            _result = null;
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @Override
  public Object getProductCount(final Continuation<? super Integer> $completion) {
    final String _sql = "SELECT COUNT(*) FROM products";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final int _tmp;
            _tmp = _cursor.getInt(0);
            _result = _tmp;
          } else {
            _result = 0;
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
