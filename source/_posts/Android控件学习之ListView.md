title: Android控件学习之ListView
toc: true
date: 2016-02-06 14:40:28
categories: [编执狂, Android]
tags: [Android, ListView原理, ListView优化, Android控件]
---

**参考资料**：
> [Adapter基础讲解 ][8]
> [Android UI][9]
> [译文][10]
> [ListView与BaseAdapter优化][11]
> [华华世界 的BLOG][12]


ListView的学习主要是适配器(Adapter)的使用以及对MVC的理解。代码尽量做到简单，为的是演示它的核心功能，不顾及界面。所以界面过丑，勿喷~~
### 1.ArrayAdapter

只需要我们提供数据，即可以显示。显示的方式使用Android提供的布局--e.g:`android.R.layout.simple_expandable_list_item_1`。还有其他的官方提供的布局,可以修改一下试一试。

>simple_list_item_1 : 单独一行的文本框
>simple_list_item_2 : 两个文本框组成，要调整数据。
>simple_list_item_checked : 每项都是有一个勾选框的列表项
![][1]
>simple_list_item_multiple_choice : 都带有一个复选框
![][2]
>simple_list_item_single_choice : 都带有一个单选钮 


<!--more-->
#### ListView主布局--activity_main.xml


```java
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="com.scauit.androidtest_fragmentandtextview.MainActivity">

   <ListView
       android:id="@+id/list"
       android:layout_width="match_parent"
       android:layout_height="match_parent"></ListView>
</RelativeLayout>

```

#### ListViewItem布局--ListViewIitem

```java
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">
<TextView
    android:id="@+id/tv_item_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
</LinearLayout>
```
#### MainActivy代码

```java
protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String[] dataStrings = {
                "Java","Python","C","C++","C#"
        };
        ArrayAdapter<String> listAdapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_expandable_list_item_1,dataStrings);
        ListView ls = (ListView) findViewById(R.id.list);
        ls.setAdapter(listAdapter);

    }
```
### ArrayAdapter的其他用法:来自['教程'][3]
>
>1.除了通过数组外，我们还可以写到一个数组资源文件中：

>比如：在res\valuse下创建一个数组资源的xml文件：arrays.xml：
```java
<?xml version="1.0" encoding="utf-8"?>  
<resources>  
    <string-array name="myarray">  
    <item>语文</item>  
    <item>数学</item>  
    <item>英语</item>  
    </string-array>      
</resources>
```
>接着布局的listview属性设置下这个列表项：
```java
<ListView  
        android:id="@id/list_test"  
        android:layout_height="match_parent"  
        android:layout_width="match_parent"   
        android:entries="@array/myarray"/>
```
就可以了~

当然我们也可以在Java代码中这样写：
```
ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
        R.array.myarray,android.R.layout.simple_list_item_multiple_choice );
```
### 2.SimpleAdapter

SimpleAdapter也是Android自己提供的一个Adapter适配器，它与ArrayAdapter不同的是ArrayAdapter需要使用Android自己定义的view布局文件，而SimpleAdapter则可以使用我们自己定义的布局文件。

![SimpleAdapter][4]

首先，我们先来看SimpleAdapter的构造方法：来自【[博客][5]】
`public SimpleAdapter(Context context, List<? extends Map<String, ?>> data,
            @LayoutRes int resource, String[] from, @IdRes int[]to)`
            
>第一个参数Context context是指当前的Activity，我们传入this即可。
第二个参数List<? extends Map<String,?>>是指传入的数据类型必须是List集合，集合存放的数据类型必须是Map。
>第三个参数int resource是指View的布局文件。传入我们的布局文件
>第四个参数 String[]from数据是以Map类型存放在List集合中的，from参数是指存放在List中每条Map数据的键值集合。
>第五个参数int[] to是指将每条Map类型的数据中的不同键值对应到不同的得布局控件中。

#### 主布局activity_main.xml

与ArrayAdapter的一样，只有一个ListView控件：

```java
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="com.scauit.androidtest_fragmentandtextview.MainActivity">

   <ListView
       android:id="@+id/list"
       android:layout_width="match_parent"
       android:layout_height="match_parent"></ListView>
</RelativeLayout>

```
#### Item布局--listview_item.xml

由于使用了第三方开源控件，需要在build.gradle中引入依赖`compile 'de.hdodenhof:circleimageview:2.0.0'`：

```java
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    testCompile 'junit:junit:4.12'
    compile 'com.android.support:appcompat-v7:23.1.1'
    compile 'de.hdodenhof:circleimageview:2.0.0'
}
```

```java
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal" android:layout_width="match_parent"
    android:layout_height="match_parent">
    <de.hdodenhof.circleimageview.CircleImageView
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:id="@+id/tv_item_img"
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:src="@drawable/profile"/>
<TextView
    android:id="@+id/tv_item_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/app_name"/>
</LinearLayout>
```
#### MainActivy代码

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //构建Item布局中的TextView的属性值
        String[] dataStrings = {
                "学习Java","学习Python","学习C","学习C++","学习C#"
        };
        //使用int来存储img的id，构建Item布局中的CircleImageView的属性值(为了演示方便，使用同一张图片)
        int[] img = new int[]{
                R.drawable.profile,
                R.drawable.profile,
                R.drawable.profile,
                R.drawable.profile,
                R.drawable.profile,
                R.drawable.profile,
        };
        
        //构建Map类型的线性表List数据，将数据存储在List<Map<String,Object>>类型中
        List<Map<String,Object>> dataList = new ArrayList<>();
        for (int i = 0; i <dataStrings.length ; i++) {
            Map<String,Object> map = new HashMap<>();
            map.put("study",dataStrings[i]);
            map.put("img",img[i]);
            dataList.add(map);
        }
        //构建构造方法的参数4，传入Map的键值数组
        String[] from = {
                "study","img"
        };
        //构建构造方法的参数5，传入Item布局的id，需要注意的是：
        //键值对与id要一一对应
        int[] to = new int[]{
                R.id.tv_item_text,
                R.id.tv_item_img
        };
        //构建SimpleAdapter对象
        SimpleAdapter simpleAdapter = new SimpleAdapter(this,dataList,R.layout.listview_item,from,to);
        ListView ls = (ListView) findViewById(R.id.list);
        ls.setAdapter(simpleAdapter);//设置

    }

}
```

### 自定义Adapter--使用最多的

#### 数据-Model

根据MVC的思想，先构造Model--数据：(新建数据类--People)

```java
public class People {
    private int img;
    private String peoName;

    public People(){
        this.img = R.drawable.profile;
        this.peoName = "无名氏";
    }
    public People(int img, String peoName, char sex, int idNum, float tall) {
        this.img = img;
        this.peoName = peoName;
    }

    /*getter and setter*/
    public int getImg() {
        return img;
    }

    public void setImg(int img) {
        this.img = img;
    }

    public String getPeoName() {
        return peoName;
    }

    public void setPeoName(String peoName) {
        this.peoName = peoName;
    }
}
```
#### 视图--View
布局文件与上述一样。

#### 自定义适配器Adapter--Controller

自定义一个Adapter，让它继承自BaseAdapter，并且实现其抽象方法。
来自【[博客][6]】
>BaseAdapter中有四个抽象的方法：public int getCount()， public Object getItem(int position)， public long getItemId(int position)， public View getView(int position, View convertview，ViewGroup viewGroup)，因此在继承BaseAdapter类后必须实现这四个方法。
>public int getCount()：
　　是用来返回数据的数量的。
　　
>public Object getItem(int position):
　　该方法使用来获得每一条ListView中的Item的，这里我们返回position即可，position是指每条Item在ListView中的位置（0， 1， 2……）。
　　
>public long getItemId(int position)：
　　　该方法是来获得ListView中每条Item的Id的，这里我们依然返回position即可。
　　　
>public View getView(int position, View convertview, ViewGroup viewGroup):
　　该方法是自定义Adapter最重要的方法，在这个方法中我们需要将数据一一对应的映射或者添加到我们自己定义的View中。然后返回view。


不需要强行记住这四个方法，使用AS的时候，当继承了BaseAdapter抽象类时，自动提醒你实现，所以，应该记住他们的功能是什么。

下面为ListViewAdapter的代码
```java
public class ListViewAdapter extends BaseAdapter {

    //定义数据
    private List<People> peoples;
    //定义Inflater,用来加载我们自定义的布局。
    //inflater是泵的意思，生动形象
    private LayoutInflater inflater;
    private Context mContext;

    //构造函数


    public ListViewAdapter(List<People> peoples, LayoutInflater inflater, Context mContext) {
        this.peoples = peoples;
        this.inflater = inflater;
        this.mContext = mContext;
    }

    @Override
    public int getCount() {
        return peoples.size();
    }

    @Override
    public Object getItem(int position) {
        return position;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        //1.创建viewHolder对象
        ViewHolder viewHolder;
        //2.获取viewHolder
        //2.1 convertview为空时，先使用inflater加载布局，
        // ViewHolder将显示在ListView中的数据通过findViewById获取到
        if (convertView == null) {
            viewHolder = new ViewHolder();
            //从inflater中获取视图
            convertView = inflater.inflate(R.layout.listview_item, parent, false);
            //将视图的控件'赋值'给viewHolder来操作
            viewHolder.circleImageView =
                    (CircleImageView) convertView.findViewById(R.id.tv_item_img);
            viewHolder.tv = (TextView) convertView.findViewById(R.id.tv_item_text);
            convertView.setTag(viewHolder);
        } else
            viewHolder = (ViewHolder) convertView.getTag();//2.2 不为空时通过Tag获取viewHolder
        //3.获取到viewHolder，对值进行设置
        viewHolder.circleImageView.setImageResource(peoples.get(position).getImg());
        viewHolder.tv.setText(peoples.get(position).getPeoName());
        return convertView;//返回视图
    }

    //ViewHolder内部类
    class ViewHolder {
        CircleImageView circleImageView;
        TextView tv;
    }
}

```

完成了数据类和适配器Adapter之后，就可以编写代码了，相对于适配器的代码来说，Activity的代码就很简单了。无非就是初始化数据，获取ListView的实例，并且设置它的适配器。

```java
    public class MainActivity extends AppCompatActivity {
    private List<People> peoples;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initData();
        ListView ls = (ListView) findViewById(R.id.list);
        LayoutInflater layoutInflater = getLayoutInflater();//获取实例
        ListViewAdapter lsAdapter = new ListViewAdapter(peoples,layoutInflater,this);
        ls.setAdapter(lsAdapter);

    }

    private void initData() {
       peoples = new ArrayList<>();
        People p1 = new People();
        People p2 = new People(R.drawable.profile,"lin");
        People p3 = new People(R.drawable.profile,"lin2");
        People p4 = new People(R.drawable.profile,"lin3");
        People p5 = new People(R.drawable.profile,"lin4");
        peoples.add(p1);
        peoples.add(p2);
        peoples.add(p3);
        peoples.add(p4);
        peoples.add(p5);

    }
}
```
OK~大功告成。偷懒了不少，很粗略地完成了ListView的学习。难点在于自定义Adapter。而自定义Adapter的难点在于getView的重写和优化【废话！】[优化之处在于使用内部类ViewHolder以及convertView]

### 3.原理浅谈与优化


看完是不是觉得很难以理解代码？为什么这样？为什么不是那样？刚开始看郭神的《第一行代码》时，也有这种感觉，不理解getView()方法是有什么用，不理解ListView的工作原理，云里雾里。

关于convertView可以参考以下的文章，这些是个人在理解原理时收集的文章，还请仔细阅读。这里结合自己的理解，理解总结getView()方法整个过程的使用，纰漏之处，还望指出~


**特别重要的一点：Recycler中'回收'的是出现过又不可见的Item类型(ItemType)**

>1. 第一次加载ListView时会先根据ListView的高度和宽度，将`layoutInflater`读取的布局创建视图，加载在ListView可见区域，对于不可见的Item暂时不加载进内存中(记得是内存)。
>2. 比如下图中，有7个Item，会根据高度，加载每个Item的布局并创建视图。
>3.使用convertView的原因在于从'布局读取'的内存方面进行优化。当Item1滑出可见区域，则被Recycler回收，该布局类型为Type1，并存在convertView当中，因为Item8的ItemType相同，均为Type1，这时候就不需要从layoutInflater中加载布局文件，而是利用convertView的View视图类型，**重用布局**，只更新Item8的数据，而不更新布局。
```java
    //也就是说如果布局文件中有一个多选框checkbox，该checkbox与数
    //据无关，只和布局相关，在Item1中为勾选状态，Item1滑出保存在
    //convertView中时，在加载Item8的时候，调用getView()返回的视
    //图Viwe是Item8的数据以及Item1的勾选状态。因为它们的布局文件
    //一样，会使得ItemType相同，重用布局。
```

>4. 所以convertView是从加载布局文件方面进行优化。
>5. **使用ViewHolder的原因是findViewById方法耗时较大**，如果控件个数过多，会严重影响性能，而使用ViewHolder主要是为了可以省去这个时间。通过setTag，getTag直接获取View。至于里面的是否要用static修饰，关于是否定义成静态，跟里面的对象数目是没有关系的，加静态是为了在多个地方使用这个Holder的时候，类只需加载一次，如果只是使用了一次，加不加也没所谓！
>6. 根据1中所述，在使用convertView的时候需要注意：
>   * 不可以设置listView的layout_height为wrap_content。原因是：
    ListView根据高度来初始化加载Item的时候，不知道本身到底要定义成多高 所以需要调用多次getView方法来计算item的高度 来填充自己，所以要match_parent或者写成固定高度。


![原理解析经典图][7]

### 4.其他优化


#### OnScrollListener-图片加载
ListView经常需要展示图片，如果在滑动时对滑动过的每张图片都要加载，会比较占内存。推荐的优化方法是设置OnScrollListener，在滑动完成后再下载当前页面的图片。

```java
listView.setOnScrollListener(new AbsListView.OnScrollListener() {
    @Override
    public void onScrollStateChanged(AbsListView view, int scrollState) {
        switch (scrollState){
            // 用户手指滑动中
            case SCROLL_STATE_TOUCH_SCROLL:
            // 用户手指离开，但滑动动画进行中
            case SCROLL_STATE_FLING:
                break;
            // 滑动结束
            case SCROLL_STATE_IDLE:
                int start = listView.getFirstVisiblePosition();
                int end = listView.getLastVisiblePosition();
                if(end >= listView.getCount()){
                    end = listView.getCount() - 1;
                }
                //展示start－end之间的图片
                break;
        }
    }

    @Override
    public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {

    }
});
```
#### Item监听

当ListView的item中有比如button这些子view时，需要对其设置`onclickListener`，通常的写法是在getView方法中一个个设置，但是这种写法每次调用getView时都设置了一个新的onClick事件，效率很低。高效的写法可以直接在ViewHolder中设置一个position，然后`viewHolder implements OnClickListenr`。

```java
class  ViewHolder implements OnClickListener{
    int position;
    TextView name;

    public void setPosition(int position){
        this.position = position;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            //XXXX
        }
    }
}

public View getView(int position, View convertView, ViewGroup parent) {
    ViewHolder holder = null;
    if (convertView == null) {
        convertView = inflater.inflate(R.layout.list_item, parent, false);
        holder = new ViewHolder();
        holder.name = (TextView) convertView.findViewById(R.id.name);
        holder.name.setOnClickListener(this);
        convertView.setTag(holder);
    } else {
        holder = (ViewHolder) convertView.getTag();
    }
    //设置holder
    holder.name.setText(list.get(position).partname);
    //设置position
    holder.setPosition(position);
    return convertView;
}
```

#### ListView的焦点问题

如果ListView中的Item中有按钮等控件抢占了焦点的获取，我们是无法使用onItem(Long)Click两个方法的，解决的办法如下：

> 1. 将Item的控件焦点获取设置为false
  `android:focusable="false"`
  当然，在代码中使用方法setFocusable(false)也可以达到同样的效果。
> 2. 对item的根节点进行设置:
  `android:descendantFocusability="blocksDescendants"`
  viewgroup会覆盖子类控件而直接获得焦点
  该属性有3个可选值，
>   * beforeDescendants：viewgroup会优先其子类控件而获取到焦点
>   * afterDescendants：viewgroup只有当其子类控件不需要获取焦点时才获取焦点
>   * blocksDescendants：viewgroup会覆盖子类控件而直接获得焦点


---

虽然内容很多，但是ListView已经逐渐被新出的RecyclerView替代。学习它的原因是想了解Adapter的自定义，为RecyclerView的使用做准备，谁叫咱基础太薄弱呢~！！哈，为了我的第一个APP，下一个内容即将会是`RecyclerView`控件的使用。



  [1]: ./images/1454742558811.jpg "1454742558811.jpg"
  [2]: ./images/1454742586021.jpg "1454742586021.jpg"
  [3]: http://www.runoob.com/w3cnote/android-tutorial-adapter.html
  [4]: http://7xobsp.com1.z0.glb.clouddn.com/2016-02-06_00001.jpg
  [5]: http://blog.csdn.net/to_be_designer/article/details/47980475
  [6]: http://blog.csdn.net/to_be_designer/article/details/47983017
  [7]: http://7xobsp.com1.z0.glb.clouddn.com/%5BAndroid%5D%20ListView%E4%B8%ADgetView%E7%9A%84%E5%8E%9F%E7%90%86%EF%BC%8B%E5%A6%82%E4%BD%95%E5%9C%A8ListView%E4%B8%AD%E6%94%BE%E7%BD%AE%E5%A4%9A%E4%B8%AAitem%20-%20%E6%9C%A8%E4%B9%83%E7%8C%AB%20-%20%E5%8D%9A%E5%AE%A2%E5%9B%AD.jpg
  [8]: http://www.runoob.com/w3cnote/android-tutorial-adapter.html
  [9]: http://blog.csdn.net/to_be_designer/article/details/47980475
  [10]: http://www.cnblogs.com/xiaowenji/archive/2010/12/08/1900579.html
  [11]: http://niorgai.github.io/2014/12/13/ListView%E4%B8%8EBaseAdapter%E4%BC%98%E5%8C%96/
  [12]: http://mzh3344258.blog.51cto.com/1823534/889879