<template>
    <table>
        <thead>
            <tr>
                <th>表头01</th>
                <th>表头02</th>
                <th>表头03</th>
                <th>表头04</th>
                <th>表头05</th>
                <th>表头06</th>
                <th>表头07</th>
                <th>表头08</th>
                <th>表头09</th>
                <th>表头10</th> 
            </tr>
        </thead>
        <tbody>
            <tr class="parent-tr">
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
                <td>一级表格</td>
            </tr>
            <tr class="child-tr">
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
                <td>二级单元格</td>
            </tr>
        </tbody>
    </table>
</template>
<script>
export default {
    name:"home_test",
    data() {
        return {

        }
    }
};
</script>

